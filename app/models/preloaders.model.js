const mongoose = require('mongoose');

// base schema for preloader
const Preloader = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  enactmentYear: String,
  act: String,
  siteTypes: [],
  epochsList: []
});

module.exports = mongoose.model('Preloader', Preloader);