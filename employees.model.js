const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let EmployeesModel = new Schema({
    name: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('EmployeesModel', EmployeesModel);