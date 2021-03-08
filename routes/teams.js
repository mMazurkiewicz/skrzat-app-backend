const router = require('express').Router();
let TeamsModel = require('../models/teams.model');

router.route('/').get(function(req, res) {
  TeamsModel.find(function(err, teams) {
    if (err) 
      console.log(err);
    else 
      res.json(teams);
  });
});

router.route('/dictionary').get(function(req, res) {
  TeamsModel.find({}, { name: 1 }, function(err, teams) {
    if (err) 
      console.log(err);
    else 
      res.json(teams);
  });
});

router.route('/:id').get(function(req, res) {
  let id = req.params.id;
  TeamsModel.findById(id, function(err, team) {
    if (err) 
      console.log(err);
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