const settings = require('../../config/settings');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/*
* POST - /user/signup
*/
router.post('/signup', (req, res, next) => {
    // search if the email already exists
    User
        .find({email: req.body.email})
        .then(user => {

            // Be careful that when you interrogate the database and the email does not exist,
            // returns an array with the value true and will trick the system that it exists
            // Best checks to contain at least one record
            if (user.length >= 1) {
                // HTTP Status: 409 - Conflict
                res.status(409).json({
                    message: 'A user with this email already exists'
                });
            } else {
                // if the email does not exist, hash the string from body.password
                // the number of rounds for salting is considered safe under 10
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        // HTTP Status: 500 - Internal Server Error
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        // if the hashing succeeded
                        // instantiate un Mongoose User object with the request data
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        // save the object into database
                        user.save().then(result => {
                            res.status(201).json({
                                message: "User created"
                            })
                        }).catch(err => {
                            res.status(500).json({
                                message: 'An error occurred',
                                errors: err
                            });
                        });
                    };
                });
            };
        });
});

/*
* POST - /user/login
*/
router.post('/login', (req, res, next) => {
    User
    .find({ email: req.body.email })
    .then(user => {
        // check if the user exists
        if (user.length < 1) {
            // HTTP Status: 401 - Unauthorized
            return res.status(401).json({
                message: 'The email or the password are incorrect'
            });
        }
        // the password is in plain text. TODO: SSL hashing
        // the password received will be hashed and compared to the password from database
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: 'The email or the password are incorrect'
                });
            }
            // email and password match
            if (result) {
                // create and sign the jwt
                const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    },
                    settings.JWT_SECRET,
                    {
                        expiresIn: "6h"
                    }
                );

                // to check the token, copy what was generated and go to jwt.io
                // the token is just coded, it's not encrypted
                return res.json({
                    message: 'Authentication succeeded',
                    token: token
                });
            }
            return res.json({
                message: 'The email or the password are incorrect'
            });
        });
    })
    .catch(err => {
        res.status(500).json({
            message: 'Errors occurred',
            err
        });
    });
});

/*
* DELETE - /user/201
*/
// to delete a user you must know the hash from the id
// use the Compass from Mongo
router.delete('/:userId', (req, res, next) => {
    User
    .remove({_id: req.params.userId})
    .then( user => {
        res.status(200).json({
            message: 'Account deleted'
        });
    })
    .catch(err => {
        res.status(500).json({
            message: 'Errors occurred',
            errors: err
        });
    });
});

module.exports = router;