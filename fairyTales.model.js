const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let FairyTalesModel = new Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
});

module.exports = mongoose.model('FairyTalesModel', FairyTalesModel);