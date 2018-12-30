const mongoose = require('mongoose');

// Un middleware de debug
// mongoose.set('debug', function(coll, method, query, doc) {
//   console.log(coll + " " + method + " " + JSON.stringify(query) + " " + JSON.stringify(doc));
// });

const User = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  password: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = mongoose.model('User', User);
