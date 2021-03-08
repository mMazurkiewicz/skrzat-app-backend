const express = require("express");
const router = express.Router();
const EmployeesModel = require('../models/employees.model');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../keys");
const passport = require('passport');

// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/0", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  EmployeesModel.findOne({ email: req.body.email }).then(employee => {
    if (employee) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      let newEmployee = new EmployeesModel({
        name: req.body.name,
        roles: req.body.roles,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) throw err;
          newEmployee.password = hash;
          newEmployee
            .save()
            .then(newEmployee => {
              res.status(200).json(newEmployee);
            })
            .catch(err => {
              res.status(400).send('adding new employee failed');
            });
        });
      });
    }
  });
});

// @route POST api/employees/login
// @desc Login employee and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  // Find employee by email
  EmployeesModel.findOne({ email }).then(employee => {
    // Check if employee exists
    if (!employee) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    // Check password
    bcrypt.compare(password, employee.password).then(isMatch => {
      if (isMatch) {
        // Employee matched
        // Create JWT Payload
        const payload = {
          _id: employee._id,
          email: employee.email,
          name: employee.name,
          roles: employee.roles,
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 15778463 // 6 months in seconds
          },
          (err, token) => {
            res.json({
              _id: employee._id,
              name: employee.name,
              email: employee.email,
              success: true,
              token: token,
              roles: employee.roles
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

router.route('/:id').post(function(req, res) {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  EmployeesModel.findById(req.params.id, function(err, employee) {
    if (!employee)
      return res.status(404).send("employee is not found");
    else
      employee.name = req.body.name;
      employee.roles = req.body.roles;
      employee.email = req.body.email;
      employee.phoneNumber = req.body.phoneNumber;

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) throw err;
          employee.password = hash;
          employee
            .save()
            .then(employee => {
              return res.status(200).json(employee);
            })
            .catch(err => {
              res.status(400).send('editing employee data failed');
            });
        });
      });
  });
});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  EmployeesModel.aggregate([
    {
      $lookup:
      {
        from: 'teamsmodels',
        localField: '_id',
        foreignField: "members._id",
        as: 'teams'
      }
    },
    { 
      $project: { "password": 0 } 
    }
  ]).exec(function(err, employees) {
    if (err) 
      res.json(err);
    else 
      res.json(employees);
  });
});

router.route('/:id').get(function(req, res) {
  let id = ObjectId(req.params.id);

  EmployeesModel.aggregate([
    {
      $match: {
        _id: id
      }
    },
    {
      $lookup:
      {
        from: 'teamsmodels',
        localField: '_id',
        foreignField: "members._id",
        as: 'teams'
      }
    },
    { 
      $project: { "password": 0 } 
    }
  ]).exec(function(err, employee) {
    if (err) 
      res.json(err);
    else 
      res.json(employee[0]);
  });
});

router.route('/:id').delete(function(req, res) {
  EmployeesModel
      .findByIdAndRemove(req.params.id)
      .then(() => res.status(200).send('entry deleted'))
});

module.exports = router;