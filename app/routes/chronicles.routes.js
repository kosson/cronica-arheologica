const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Chronicle = require('../models/chronicles.model');
const checkAuth = require('../controllers/checkAuth.controller');

/*
* resource loading strategy
* # instantiation with multer
* multer offers middlewares that can be added before any handler
*/
const multer = require('multer');

// storage location
const storage = multer.diskStorage({
  destination: function setDestination (req, file, cb) {
    cb(null, './repo/');
  },
  filename: function setFilename (req, file, cb) {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

// filters the type of allowed files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/png') {
    cb(null, true); // accepts the upload
  } else {
    cb(null, false); // rejects the upload
  };
};

// configuring multer settings
const upload = multer({
  storage,
  limits: {fileSize: 1024 * 1024 * 10},
  fileFilter
});

// TODO: Make a directory for the images associated with each record.

/*
* Routes
*/
// GET localhost:8000/chronicles
router.get('/', (req, res, next) => {
  Chronicle
    .find()
    .then( chronicles => {
      res.status(200).json(chronicles);
    }).catch( err => {
    res.status(500).json({err})
  });
});

// GET localhost:8000/chronicles/5a9aa163f0b9330452e333e8
router.get('/:caId', (req, res, next) => {
  const id = req.params.caId;
  Chronicle
    .findById(id)
    .exec()
    .then( doc => {
      res.status(200).json({doc});
    })
    .catch( err => {
      res.status(500).json({error: err});
    });
});

// POST /chronicles to save resources
// WARNING: protected route; the checkAuth middleware is run first
router.post('/', checkAuth, (req, res, next) => {
  /*
  * router.post('/', upload.single('image'), (req, res, next) => {
  * because you run the middleware before the handler, you will have middleware methods available.
  * In the method, enter the field name (image)
  * Multer offers req.file
  */

  //TODO: separates the upload of files and the upload of data and insert a field in the record for the assigned files

  // Fills data in the Chronicle model
  const chronicle = new Chronicle({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    city: req.body.city,
    county: req.body.county,
    address: req.body.address,
    uat: req.body.uat,
    siruta: req.body.siruta,
    ran: req.body.ran,
    toponym: req.body.toponym,
    sector: req.body.sector,
    year: req.body.year,
    siteType: req.body.siteType,
    siteCategory: req.body.siteCategory,
    periods: req.body.periods,
    epochs: req.body.epochs,
    cultures: req.body.cultures,
    members: req.body.members,
    authorizationNo: req.body.authorizationNo,
    authorizationYear: req.body.authorizationYear,
    contractValue: req.body.contractValue,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    siteDescription: req.body.siteDescription,
    targets: req.body.targets,
    interpretationResults: req.body.interpretationResults,
    shortDescription: req.body.shortDescription,
    analysisTechniques: req.body.analysisTechniques,
    conclusions: req.body.conclusions,
    bibliographicReferences: req.body.bibliographicReferences,
    summary: req.body.summary,
    lastUpdate: req.body.lastUpdate
  });

  // TODO: add support for multiform data loading (support provided by multer)

  // saves the data in the database
  chronicle
    .save()
    .then(result => {
      res.status(200).json(result);
    }).catch(err => {
    res.status(500).json({error: err})
  });
});

// manages POST requests
// router.post('/:caId', (req, res, next) => {
//     console.log(req.toValue());
// });

// PATCH pe /chronicles/id-StringHash
// WARNING: protected route; the checkAuth middleware is run first
router.patch('/:caId', checkAuth, (req, res, next) => {
  const id = req.param.caId;
  const updOps = {};

  // takes the received record which is the partially modified
  // builds a work object for the update method
  for (let [key, value] of Object.entries(req.body)) {
    updOps[key] = value;
  };

  Chronicle
    .update( {id}, {
      $set: updOps
    })
    .then( result => {
      res.status(200).json({result}); // returns the entire updated record
    })
    .catch( err => {
      res.status(500).json({message: err.message});
    });
});

// DELETE /chronicles/id-StringHash
// WARNING: protected route; the checkAuth middleware is run first
router.delete('/:caId', checkAuth, (req, res, next) => {
  const id = req.params.caId;

  Chronicle
    .remove({id})
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.json({error: err.message});
    });
});

module.exports = router;