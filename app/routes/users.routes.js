const settings = require('../../config/settings');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/users.model');
const jwt = require('jsonwebtoken');

router.post('/signup', (req, res, next) => {
    // mai întâi verifică dacă în baza de date nu cumva există adresa de email
    User
    .find({email: req.body.email})
    .then(user => {
        // fii atent că atunci cand interoghezi baza, emailul nu există, ți se
        // întoarce un array care va fi valoare truthy și va păcăli sistemul că există
        // chiar dacă nu e. Cel mai bine verifică să fie cel puțin o înregistrare
        if (user.length >= 1) {
            res.json({
                message: 'Există deja un utilizator cu acest email.'
            });
        } else {
            // numărul de runde pentru salting este considerat ca sigur undeva la 10
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.json({
                        error: err
                    });
                } else {
                    // dacă hashingul a reușit, abia atunci creează obiectul în baza modelului
                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user.save().then(result => {
                        res.json({                    
                            message: "Am creat userul fără probleme"
                        })
                    }).catch(err => {
                        res.json({
                            message: 'A apărut o eroare la crearea utilizatorului',
                            errors: err
                        });
                    });
                }
            });    
        }
    });
});

// creează ruta de logare prin care serverul creează tokenul
router.post('/login', (req, res, next) => {
    User.find({
        email: req.body.email
    }).then(user => {
        // Prima verificare: există userul?
        // dacă nu este returnat niciun utilizator
        if (user.length < 1) {
            return res.json({
                message: 'Fie emailul, fie parola sunt greșite'
            });
        }
        // parola care vine este în text. Ar fi necesară criptarea SSL
        // parola primită va fi hashuită din nou și va fi comparată cu cea din bază.
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.json({
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
                    expiresIn: "1h"
                }
            ); // pentru a verifica tokenul, copiază ce s-a generat și mergi pe jwt.io
                return res.json({
                    message: 'User și parolă corecte. Autentificare reușită!',
                    token: token
                });
            }
            return res.json({
                message: 'Fie emailul, fie parola sunt greșite'
            });
        });
    }).catch(err => {
        res.json({
            message: 'Au apărut erori în procesarea solicitării',
            err
        });
    });
});

router.delete('/:userId', (req, res, next) => {
    User.remove({_id: req.params.userId}).then(user => {
        res.json({
            message: 'Am șters contul utilizatorului ' + user
        });
    }).catch(err => {
        res.json({
            message: 'A apărut o problemă la ștergerea contului',
            errors: err
        });
    });
});

module.exports = router;