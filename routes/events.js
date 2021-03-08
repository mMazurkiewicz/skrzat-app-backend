const router = require('express').Router();
let EventsModel = require('../models/events.model');

router.route('/').get(function(req, res) {
  EventsModel.find(function(err, events) {
    if (err) {
      console.log(err);
    } else {
      res.json(events);
    }
  });
});

router.route('/:id').get(function(req, res) {
  let id = req.params.id;
  EventsModel.findById(id, function(err, events) {
    if (err) {
      console.log(err);
    } else {
      res.json(events);
    }
  });
});

router.route('/0').post(function(req, res) {
  let event = new EventsModel(req.body);
  event.save()
  .then(event => {
    res.status(200).json(event);
  })
  .catch(err => {
    res.status(400).send('adding new event failed');
  });
});

router.route('/:id').post(function(req, res) {
  EventsModel.findById(req.params.id, function(err, event) {
    if (!event)
      res.status(404).send("data is not found");
    else
      event.team = req.body.team;
      event.venue = req.body.venue;
      event.dateTime = req.body.dateTime;
      event.fairyTale = req.body.fairyTale;

      event.save().then(event => {
        res.json(event);
      })
      .catch(err => {
        res.status(400).json(err);
      });
  });
});

router.route('/:id').delete(function(req, res) {
  EventsModel
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(200).send('entry deleted'))
});

module.exports = router;