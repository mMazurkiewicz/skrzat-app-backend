const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let FairyTalesModel = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('FairyTalesModel', FairyTalesModel);