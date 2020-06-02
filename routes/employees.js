const router = require('express').Router();
let EmployeesModel = require('../models/employees.model');

router.route('/').get(function(req, res) {
  EmployeesModel.find(function(err, employees) {
      if (err) {
          console.log(err);
      } else {
          res.json(employees);
      }
  });
});

router.route('/:id').get(function(req, res) {
  let id = req.params.id;
  EmployeesModel.findById(id, function(err, employees) {
      res.json(employees);
  });
});

router.route('/0').post(function(req, res) {
  let employee = new EmployeesModel(req.body);
  employee.save()
      .then(employee => {
          res.status(200).json(employee);
      })
      .catch(err => {
          res.status(400).send('adding new employee failed');
      });
});

router.route('/:id').post(function(req, res) {
EmployeesModel.findById(req.params.id, function(err, employee) {
  if (!employee)
    res.status(404).send("data is not found");
  else
    employee.name = req.body.name;
    employee.mail = req.body.mail;
    employee.phoneNumber = req.body.phoneNumber;

    employee.save().then(employee => {
        res.json(employee);
    })
    .catch(err => {
        res.status(400).json(err);
    });
});
});

router.route('/:id').delete(function(req, res) {
  EmployeesModel
      .findByIdAndRemove(req.params.id)
      .then(() => res.status(200).send('entry deleted'))
});

module.exports = router;