const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var MemberSchema = new Schema({ name: String, _id: String });

let TeamsModel = new Schema({
    name: {
        type: String,
        required: true
    },
    members: [MemberSchema],
});

module.exports = mongoose.model('TeamsModel', TeamsModel);