const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var MemberSchema = new Schema({ name: String, _id: ObjectId });

let TeamsModel = new Schema({
    name: {
        type: String,
        required: true
    },
    members: [MemberSchema],
});

module.exports = mongoose.model('TeamsModel', TeamsModel);