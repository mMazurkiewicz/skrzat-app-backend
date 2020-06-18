const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let VenuesModel = new Schema({
    name: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    streetNo: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    postOffice: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    website: {
        type: String,
    },
    additionalInfo: {
        type: String,
    },
    lastContact: {
        type: String,
    },
});

module.exports = mongoose.model('VenuesModel', VenuesModel);