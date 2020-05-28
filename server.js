const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;

const fairyTalesRoutes = express.Router();
let FairyTalesModel = require('./fairyTales.model')

const employeesRoutes = express.Router();
let EmployeesModel = require('./employees.model')

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/skrzat-app-db', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

// fairyTales endpoints
fairyTalesRoutes.route('/').get(function(req, res) {
    FairyTalesModel.find(function(err, fairyTales) {
        if (err) {
            console.log(err);
        } else {
            res.json(fairyTales);
        }
    });
});

fairyTalesRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    FairyTalesModel.findById(id, function(err, fairyTales) {
        res.json(fairyTales);
    });
});

fairyTalesRoutes.route('/0').post(function(req, res) {
    let fairyTale = new FairyTalesModel(req.body);
    fairyTale.save()
        .then(fairyTale => {
            res.status(200).json(fairyTale);
        })
        .catch(err => {
            res.status(400).send('adding new fairyTale failed');
        });
});

fairyTalesRoutes.route('/:id').post(function(req, res) {
  FairyTalesModel.findById(req.params.id, function(err, fairyTale) {
    if (!fairyTale)
      res.status(404).send("data is not found");
    else
      fairyTale.name = req.body.name;
      fairyTale.description = req.body.description;

      fairyTale.save().then(fairyTale => {
          res.json(fairyTale);
      })
      .catch(err => {
          res.status(400).json(err);
      });
  });
});

fairyTalesRoutes.route('/:id').delete(function(req, res) {
    FairyTalesModel
        .findByIdAndRemove(req.params.id)
        .then(() => res.status(200).send('entry deleted'))
});

// employees endpoints
employeesRoutes.route('/').get(function(req, res) {
    EmployeesModel.find(function(err, employees) {
        if (err) {
            console.log(err);
        } else {
            res.json(employees);
        }
    });
});

employeesRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    EmployeesModel.findById(id, function(err, employees) {
        res.json(employees);
    });
});

employeesRoutes.route('/0').post(function(req, res) {
    let employee = new EmployeesModel(req.body);
    employee.save()
        .then(employee => {
            res.status(200).json(employee);
        })
        .catch(err => {
            res.status(400).send('adding new employee failed');
        });
});

employeesRoutes.route('/:id').post(function(req, res) {
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

employeesRoutes.route('/:id').delete(function(req, res) {
    EmployeesModel
        .findByIdAndRemove(req.params.id)
        .then(() => res.status(200).send('entry deleted'))
});


// root endpoints
app.use('/fairyTales', fairyTalesRoutes);

app.use('/employees', employeesRoutes);

// listen
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});