let mongoose = require('mongoose');

// member of the excavating or research team
const Member = mongoose.Schema({
  fullName: {type: String, trim: true},
  affiliation: [{type: String, trim: true}],
  role: [{type: String, trim: true}],
  researchType: [{type: String, trim: true}]
});

// base schema for chronicle
const Chronicle = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  chronicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Preloader'
  },
  name: {
    type: String,
    trim: true,
    required: true
  },
  city: {type: String, trim: true},
  county: {type: String, trim: true},
  address: {type: String, trim: true},
  uat: {type: String, trim: true},
  siruta: {type: String, trim: true},
  ran: {type: String, trim: true},
  toponym: {type: String, trim: true},
  sector: {type: String, trim: true},
  year: {type: String, trim: true},
  siteType: {type: String, trim: true},
  siteCategory: {type: String, trim: true},
  periods: {type: String, trim: true},
  epochs: [{type: String, trim: true}],
  cultures: [{type: String, trim: true}],
  members: [Member],
  authorizationNo: {type: String, trim: true},
  authorizationYear: {type: String, trim: true},
  contractValue: {type: String, trim: true},
  startDate: {type: String, trim: true},
  endDate: {type: String, trim: true},
  siteDescription: {type: String, trim: true},
  targets: {type: String, trim: true},
  interpretationResults: {type: String, trim: true},
  shortDescription: {type: String, trim: true},
  analysisTechniques: {type: String, trim: true},
  conclusions: {type: String, trim: true},
  bibliographicReferences: {type: String, trim: true},
  summary: {type: String, trim: true},
  lastUpdate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Chronicle', Chronicle);
