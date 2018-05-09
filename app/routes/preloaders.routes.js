const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Preloader = require('../models/preloaders.model');
const checkAuth = require('../controllers/checkAuth.controller');

// TODO: Explore the possibility to load preloaders into localStorage

// manages GET requests
router.get('/', checkAuth, (req, res, next) => {
  Preloader
    .find()
    .exec()
    .then(preloaders => {
      res.json(preloaders);
    }).catch((err) => {
    res.json({err: err})
  });
});

// manages GET requests with id
router.get('/:preloaderId', (req, res, next) => {
  const id = req.params.preloaderId;
  Preloader.findById(id).exec().then(doc => {
    console.log(doc);
    if (doc) {
      res.json({doc});
    } else {
      res.json({
        message: "Missing resource"
      });
    }
  }).catch(err => {
    console.log(err);
    res.json({error: err});
  });
});

// gestionează cererile cu POST
router.post('/', (req, res, next) => {
  // incarca modelul cu date din body
  const preloader = new Preloader({
    _id: new mongoose.Types.ObjectId(),
    anulAdoptarii: req.body.anulAdoptarii,
    prinAct: req.body.prinAct,
    tipuriSit: req.body.tipuriSit,
    listaEpoci: req.body.listaEpoci
  });
  preloader.save().then(result => {
    console.log(result);
  }).catch(err => {
    console.log(err);
  });
  res.json({
    mesaj: 'fac POST pe /preloadere',
    amCreatPreloader: preloader
  });
});

// manages POST requests
router.post('/:preloaderId', (req, res, next) => {

});

// manages PATCH requests
router.patch('/:preloaderId', (req, res, next) => {
  const id = req.param.preloaderId;
  const updOps = {};
  for (let [key, value] of Object.entries(req.body)){
    updOps[key] = value;
  }
  Preloader.update({id}, {
    $set: updOps
  }).then(result => {
    res.json({result});
  }).catch(err => {
    res.json({message: err.message});
  });
});

// manages DELETE requests
router.delete('/:preloaderId', (req, res, next) => {
  const id = req.params.preloaderId;
  Preloader.remove({id}).then(result => {
    res.json(result);
  }).catch(err => {
    res.json({error: err.message});
  });
});

module.exports = router;