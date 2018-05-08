const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

/**
 * SIGNUP
 * LOGIN
 * DELETE USER
*/

// Signup
exports.user_signup = (req, res, next) => {
    // search if the email already exists
    User.find({ email: req.body.email })
        .exec()
        .then( user => {
            if (user.length >= 1) {
                return res.json({
                    message: "This email already exists"
                });
            } else {
                // if the email does not exist, the hashing will be done
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.json({
                            error: err
                        });
                    } else {
                        // if the hashing succeeded, load the data model
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        // save the object into database
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.json({
                                    message: "User created"
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
};

// Login
exports.user_login = (req, res, next) => {
    // search the database for an email
    User.find({ email: req.body.email })
        .exec()
        .then (user => {
            // the user object is received if the email has been identified
            if (user.length < 1) {
                return res.json({
                    message: "Authentication failed"
                });
            };
            // compares the token received and executes the callback
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.json({
                        message: "Authentication failed"
                    });
                };
                // if the resulting object exists
                // it means that the email and the password are correct
                if (result) {
                    // generates a signed token with an expiration period
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );
                    // send the token
                    return res.json({
                        message: "Authentication succeeded",
                        token: token
                    });
                };
                // no correspondent in the database
                res.json({
                    message: "Authentication failed"
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.json({
                error: err
            });
        });
};

// Delete user
exports.user_delete = (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.json({
                message: "User deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.json({
                error: err
            });
        });
};
