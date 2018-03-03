const mongoose = require('mongoose');
const Preloader = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  anulAdoptarii: String,
  prinAct: String,
  tipuriSit: [],
  listaEpoci: []
});

module.exports = mongoose.model('Preloader', Preloader);
