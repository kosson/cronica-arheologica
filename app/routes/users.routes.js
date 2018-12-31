const express   = require('express');
const router    = express.Router();
const mongoose  = require('mongoose');
const bcrypt    = require('bcrypt');
const jwt       = require('jsonwebtoken');
// middleware 
const checkAuth      = require('../middleware/auth');
const User           = require('../models/users.model');
const UserController = require('../controllers/user.controller');

// GET - /users/
router.get('/', (req, res, next) => {
  User
    .find()
    .then( users => {
      res.status(200).json(users);
    }).catch( err => {
      res.status(500).json({err});
    });
});

/* POST */
// ROUTE: users/signup
router.post('/signup', UserController.user_signup);

// ROUTE: users/login
router.post('/login', UserController.user_login);

/* DELETE - /user/201 */
// to delete a user you must know the hash from the id
// use the Compass from Mongo
router.delete("/:userId", checkAuth, UserController.user_delete);

module.exports = router;
