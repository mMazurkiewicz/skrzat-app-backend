const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let EmployeesModel = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  roles: [{type: String}],
});

module.exports = mongoose.model('EmployeesModel', EmployeesModel);