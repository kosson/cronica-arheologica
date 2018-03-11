/**
 * Constituirea modelului de date pentru înregistrare
 * Dependințe: mongoose
 */
var mongoose = require('mongoose');

// Constituirea unui subdocument
var Colectiv = mongoose.Schema({
  numeprenum: {type: String, trim: true},
  afiliere: [{type: String, trim: true}],
  rol: [{type: String, trim: true}],
  tipcercetare: [{type: String, trim: true}]
});

// Constituirea înregistrării principală
// atașez subdocumentul Colectiv
var Cronica = mongoose.Schema({
      _id: mongoose.Schema.Types.ObjectId,
      denumire: {
        type: String,
        trim: true
      },
      localitate: {type: String, trim: true},
      judet: {type: String, trim: true},
      adresa: {type: String, trim: true},
      uat: {type: String, trim: true},
      siruta: {type: String, trim: true},
      ran: {type: String, trim: true},
      toponim: {type: String, trim: true},
      sector: {type: String, trim: true},
      anul: {type: String, trim: true},
      tipsit: {type: String, trim: true},
      categoriesit: {type: String, trim: true},
      perioade: {type: String, trim: true},
      epoci: [{type: String, trim: true}],
      culturi: [{type: String, trim: true}],
      colectiv: [Colectiv],
      nrautorizatie: {type: String, trim: true},
      anautoriz: {type: String, trim: true},
      valcontract: {type: String, trim: true},
      datainceperii: {type: String, trim: true},
      datafinalizarii: {type: String, trim: true},
      prezentaresit: {type: String, trim: true},
      obiectivele: {type: String, trim: true},
      rezultateleinterpretare: {type: String, trim: true},
      scurtadescriere: {type: String, trim: true},
      tehnicianaliza: {type: String, trim: true},
      concluziirap: {type: String, trim: true},
      referintebibl: {type: String, trim: true},
      rezumat: {type: String, trim: true},
      actualizat: { type: Date, default: Date.now }
    });

module.exports = mongoose.model('Cronica', Cronica);
