const router = require('express').Router();
let VenuesModel = require('../models/venues.model');

router.route('/').get(function(req, res) {
  // use options in future for filtration
  // const options = { name: {
  //   '$regex': 'domowe przedszkole', 
  //   '$options': 'i'
  // }};
  const { page, itemsPerPage } = req.query;
  const skip = Number(page) > 0 ? ( ( Number(page) - 1 ) * Number(itemsPerPage) ) : 0;
  const limit = Number(itemsPerPage);

  VenuesModel.aggregate([
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
  ]).exec(function(err, teams) {
    if (err) 
      res.json(err);
    else 
      res.json(teams);
  })
});

router.route('/dictionary').get(function(req, res) {
  const value = req.query.value || "";

  VenuesModel.find(
    {
      '$or': [
        {
          name: {
            '$regex': value, 
            '$options': 'i'
          }
        },
        {
          city: {
            '$regex': value, 
            '$options': 'i'
          }
        }
      ]
    }, 
    { name: 1, city: 1 }, 
    function(err, teams) {
      if (err) 
        res.json(err);
      else 
        res.json(teams);
  })
  .limit(200);
});

router.route('/:id').get(function(req, res) {
  let id = req.params.id;
  VenuesModel.findById(id, function(err, team) {
    if (err) 
      res.json(err);
    else 
      res.json(team);
  });
});

router.route('/0').post(function(req, res) {
  let team = new VenuesModel(req.body);
  
  team.save()
    .then(team => {
      res.status(200).json(team);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

router.route('/:id').post(function(req, res) {
  VenuesModel.findById(req.params.id, function(err, team) {
    if (!team)
      res.status(404).send("data is not found");
    else
      team.name = req.body.name;
      team.street = req.body.street;
      team.streetNo = req.body.streetNo;
      team.city = req.body.city;
      team.zip = req.body.zip;
      team.postOffice = req.body.postOffice;
      team.phone = req.body.phone;
      team.website = req.body.website;
      team.additionalInfo = req.body.additionalInfo;
      team.lastContact = req.body.lastContact;

      team.save().then(team => {
          res.json(team);
      })
      .catch(err => {
          res.status(400).json(err);
      });
  });
});

router.route('/:id').delete(function(req, res) {
  VenuesModel
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(200).send('entry deleted'))
});

module.exports = router;