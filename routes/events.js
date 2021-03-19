const router = require('express').Router();
let EventsModel = require('../models/events.model');

router.route('/').get(function(req, res) {
  const { page, itemsPerPage } = req.query;
  const skip = Number(page) > 0 ? ( ( Number(page) - 1 ) * Number(itemsPerPage) ) : 0;
  const limit = Number(itemsPerPage);

  EventsModel.aggregate([
    {
      $lookup:
      {
        from: 'venuesmodels',
        localField: 'venue._id',
        foreignField: "_id",
        as: 'venue'
      },
    },
    {
      $lookup:
      {
        from: 'teamsmodels',
        localField: 'team._id',
        foreignField: "_id",
        as: 'team'
      },
    },
    {
      $lookup:
      {
        from: 'fairytalesmodels',
        localField: 'fairyTale._id',
        foreignField: "_id",
        as: 'fairyTale'
      },
    },
    {
      $unwind: '$venue',
    },
    {
      $unwind: '$team',
    },
    {
      $unwind: '$fairyTale'
    },
    { $match: {} },
    {
      $facet: {
        items: [
          { $skip: skip },
          { $limit: limit },
        ],
        metaData: [
          { 
            $group: { 
              _id: null, 
              totalItems: { $sum: 1 } ,
            },
          },
        ],
      },
    },
    { $unwind : "$metaData" },
  ]).exec(function(err, employees) {
    if (err) 
      res.json(err);
    else 
      res.json(employees);
  });
});

router.route('/:id').get(function(req, res) {
  let id = req.params.id;
  EventsModel.findById(id, function(err, events) {
    if (err) {
      res.json(err);
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