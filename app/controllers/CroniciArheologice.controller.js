/**
 * Controler pentru CRUD cronici
 * #1 importă modelul
 */
var Cronica = require('../models/croniciArheologice.model');

// creează o înregistrare nouă
exports.create = function (req, res) {
    if(!req.body.content) {
      res.send({
        message: "Nu pot trimite o înregistrare goală în bază!"
      });
    };
    var record = new Cronica({
      localitate:  req.body.localitate,
      judet:  req.body.judet,
      adresa:  req.body.adresa,
      uat:  req.body.uat,
      siruta:  req.body.siruta,
      ran:  req.body.ran,
      toponim:  req.body.toponim,
      sector:  req.body.sector,
      anul:  req.body.anul,
      tipsit:  req.body.tipsit,
      categoriesit:  req.body.categoriesit,
      perioade:  req.body.perioade,
      epoci: [{epoca:  req.body.epoci}],
      culturi: [{cultura:  req.body.culturi}],
      colectiv: [{
        numeprenum: req.body.colectiv[0].numeprenum,
        afiliere: [],
        rol: [],
        tipcercetare: []
      }],
      nrautorizatie: String,
      anautoriz: String,
      valcontract: String,
      datainceperii: String,
      datafinalizarii: String,
      prezentaresit: String,
      obiectivele: String,
      rezultateleinterpretare: String,
      scurtadescriere: String,
      tehnicianaliza: String,
      concluziirap: String,
      referintebibl: String,
      rezumat: String
    });
    records.save( function (err, data) {
        console.log(data);
        if(err) {
            console.log(err);
            res.status(500).send({message: "Au apărut erori"});
        } else {
            res.send(data);
        }
    });
};
// adu din bază și returnează toate înregistrările pentru form01
exports.findAll = function(req, res) {

};
// găsește o singură înregistrare după id
exports.findOne = function(req, res) {

};
// actualizează o înregistrare identificată după id-ul din cerere
exports.update = function(req, res) {

};
// șterge o înregistrare după id-ul din cerere
exports.delete = function(req, res) {

};
