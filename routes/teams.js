const router = require('express').Router();
let TeamsModel = require('../models/teams.model');

router.route('/').get(function(req, res) {
  const { page, itemsPerPage } = req.query;
  const skip = Number(page) > 0 ? ( ( Number(page) - 1 ) * Number(itemsPerPage) ) : 0;
  const limit = Number(itemsPerPage);

  TeamsModel.aggregate([
    { $match: {} },
    {
      $lookup: {
        from: 'employeesmodels',
        localField: 'members',
        foreignField: "_id",
        as: 'members'
      },
    },
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
    {
      $project: {
        "metaData": 1,
        "items": {
          "_id": 1,
          "name": 1,
          "color": 1,
          "members": { "name": 1, "_id": 1 }}
      }
    }
  ]).exec(function(err, teams) {
    if (err) 
      res.json(err);
    else 
      res.json(teams);
  })
});

router.route('/dictionary').get(function(req, res) {
  TeamsModel.find({}, { name: 1, color: 1 }, function(err, teams) {
    if (err) 
      res.json(err);
    else 
      res.json(teams);
  });
});

router.route('/:id').get(function(req, res) {
  let id = req.params.id;
  TeamsModel.findById(id, function(err, team) {
    if (err) 
      res.json(err);
    else 
      res.json(team);
  });
});

router.route('/0').post(function(req, res) {
  let team = new TeamsModel(req.body);
  
  team.save()
    .then(team => {
      res.status(200).json(team);
    })
    .catch(err => {
      res.status(400).send('adding new team failed');
    });
});

router.route('/:id').post(function(req, res) {
  TeamsModel.findById(req.params.id, function(err, team) {
    if (!team)
      res.status(404).send("data is not found");
    else
      team.name = req.body.name;
      team.members = req.body.members;
      team.color = req.body.color;

      team.save().then(team => {
          res.json(team);
      })
      .catch(err => {
          res.status(400).json(err);
      });
  });
});

router.route('/:id').delete(function(req, res) {
  TeamsModel
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(200).send('entry deleted'))
});

module.exports = router;