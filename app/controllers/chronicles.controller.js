// this file contains all the methods necessary for CRUD
var Form01 = require('../models/form01.model.js');

// create new record
exports.create = function(req, res) {
  if(!req.body.content) {
      res.status(400).send({message: 'Record must not be empty.'});
    }
    var form01 = new Form01({
        city:  req.body.city,
        county:  req.body.county,
        address:  req.body.address,
        uat:  req.body.uat,
        siruta:  req.body.siruta,
        ran:  req.body.ran,
        toponym:  req.body.toponym,
        sector:  req.body.sector,
        year:  req.body.year,
        siteType:  req.body.siteType,
        siteCategory:  req.body.categoriesit,
        periods:  req.body.perioade,
        epochs: [{epoca:  req.body.epoci}],
        cultures: [{cultura:  req.body.culturi}],
        members: [{
            fullName: req.body.colectiv[0].fullName,
            affiliation: [],
            role: [],
            researchType: []
        }],
        authorizationNo: String,
        authorizationYear: String,
        contractValue: String,
        startDate: String,
        endDate: String,
        siteDescription: String,
        targets: String,
        interpretationResults: String,
        shortDescription: String,
        analysisTechniques: String,
        conclusions: String,
        bibliographicReferences: String,
        summary: String
    });
    // title: req.body.title || "Untitled Note", content: req.body.content
    note.save( function(err, data) {
        console.log(data);
        if(err) {
            console.log(err);
            res.status(500).send({message: 'Errors occurred'});
        } else {
            res.send(data);
        }
    });
};

// returns all records
exports.findAll = function(req, res) {

};
// finds a single record by id
exports.findOne = function(req, res) {

};
// updates a record identified by the request id
exports.update = function(req, res) {

};
// deletes a record identified by the request id
exports.delete = function(req, res) {

};
