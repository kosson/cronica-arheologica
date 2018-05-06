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
    // mai întâi verifică dacă în baza de date nu cumva există adresa de email
    User
    .find({email: req.body.email})
    .then(user => {
        // fii atent că atunci cand interoghezi baza, emailul nu există, ți se
        // întoarce un array care va fi valoare truthy și va păcăli sistemul că există
        // chiar dacă nu e. Cel mai bine verifică să fie cel puțin o înregistrare
        if (user.length >= 1) {
            // HTTP Status: 409 - Conflict
            res.status(409).json({
                message: 'Există deja un utilizator cu acest email.'
            });
        } else {
            // dacă nu există emailul, criptează stringul din body.password
            // numărul de runde pentru salting este considerat ca sigur undeva la 10
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    // HTTP Status: 500 - Internal Server Error
                    return res.status(500).json({
                        error: err
                    });
                } else {                    
                    // dacă hashingul a reușit, 
                    // instanțiază un obiect Mongoose User cu datele din request
                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    // salvează în baza de date!!!
                    user.save().then(result => {
                        res.status(201).json({                    
                            message: "Am creat userul fără probleme"
                        })
                    }).catch(err => {
                        res.status(500).json({
                            message: 'A apărut o eroare la crearea utilizatorului',
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
// creează ruta de logare prin care serverul creează tokenul
router.post('/login', (req, res, next) => {
    User
    .find({ email: req.body.email })
    .then(user => {
        // Prima verificare: există userul?
        // dacă nu este returnat niciun utilizator
        if (user.length < 1) {
            // HTTP Status: 401 - Unauthorized
            return res.status(401).json({
                message: 'Fie emailul, fie parola sunt greșite'
            });
        }
        // parola care vine este în text. TODO: criptare SSL pentru server musai!
        // parola primită va fi hashuită din nou și va fi comparată cu cea din bază.
        // fii foarte atent căci, în viitor trebuie să folosești același hash cu același algoritm pentru a putea compara
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: 'Fie emailul, fie parola sunt greșite'
                });
            }
            // dacă parola se potrivește cu userul, result va fi true
            if (result) {
                // dacă avem un rezultat pozitiv, creează și semnează jwt-ul
                // atenție, în acest moment tokenul nu este criptat, este doar codat
                const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    },
                    settings.JWT_SECRET,
                    {
                        expiresIn: "6h"
                    }
                ); // pentru a verifica tokenul, copiază ce s-a generat și mergi pe jwt.io
                // Tokenul este doar codat, nu este și criptat! Fii foarte atent, info este vizibilă
                return res.json({
                    message: 'User și parolă corecte. Autentificare reușită!',
                    token: token
                });
            }
            // dacă compare a eșuat indică!!!
            return res.json({
                message: 'Fie emailul, fie parola sunt greșite'
            });
        });
    })
    .catch(err => {
        res.status(500).json({
            message: 'Au apărut erori în procesarea solicitării',
            err
        });
    });
});

/*
* DELETE - /user/201
*/
// pentru a șterge un utilizator trebuie să cunoști hash-ul din id
// pentru lucru rapid, folosește Compass-ul de la Mongo
router.delete('/:userId', (req, res, next) => {
    User
    .remove({_id: req.params.userId})
    .then( user => {
        res.status(200).json({
            message: 'Am șters contul'
        });
    })
    .catch(err => {
        res.status(500).json({
            message: 'A apărut o problemă la ștergerea contului',
            errors: err
        });
    });
});

module.exports = router;