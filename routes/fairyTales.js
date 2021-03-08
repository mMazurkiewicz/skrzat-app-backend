const router = require('express').Router();
let FairyTalesModel = require('../models/fairyTales.model');

router.route('/').get(function(req, res) {
  FairyTalesModel.find(function(err, fairyTales) {
    if (err) {
      res.json(err);
    } else {
      res.json(fairyTales);
    }
  });
});

router.route('/dictionary').get(function(req, res) {
  FairyTalesModel.find({}, { name: 1 }, function(err, fairyTales) {
    if (err) {
      res.json(err);
    } else {
      res.json(fairyTales);
    }
  });
});

router.route('/:id').get(function(req, res) {
  let id = req.params.id;
  FairyTalesModel.findById(id, function(err, fairyTales) {
    res.json(fairyTales);
  });
});

router.route('/0').post(function(req, res) {
  let fairyTale = new FairyTalesModel(req.body);
  fairyTale.save()
  .then(fairyTale => {
    res.status(200).json(fairyTale);
  })
  .catch(err => {
    res.status(400).send('adding new fairyTale failed');
  });
});

router.route('/:id').post(function(req, res) {
  FairyTalesModel.findById(req.params.id, function(err, fairyTale) {
    if (!fairyTale)
      res.status(404).send("data is not found");
    else
      fairyTale.name = req.body.name;
      fairyTale.description = req.body.description;

      fairyTale.save().then(fairyTale => {
        res.json(fairyTale);
      })
      .catch(err => {
        res.status(400).json(err);
      });
  });
});

router.route('/:id').delete(function(req, res) {
  FairyTalesModel
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(200).send('entry deleted'))
});

module.exports = router;