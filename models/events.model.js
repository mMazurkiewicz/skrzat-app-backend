const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

let EventsModel = new Schema({
    dateTime: {
      type: Date,
      required: true,
    },
    venue: {
      name: { type: String, required: true },
      city: { type: String, required: true },
      _id: {type: ObjectId, required: true },
    },
    fairyTale: {
      name: { type: String, required: true },
      _id: {type: ObjectId, required: true },
    },
    team: {
      name: { type: String, required: true },
      color: { type: String, required: true },
      _id: {type: ObjectId, required: true },
    },
});

module.exports = mongoose.model('EventsModel', EventsModel);