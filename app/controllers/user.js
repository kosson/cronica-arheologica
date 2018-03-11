const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

/**
 * CREAREA UNUI CONT
 * AUTENTIFICAREA UTILIZATOR
 * ȘTERGERE USER
*/

// CREARE CONT
exports.user_signup = (req, res, next) => {
  // caută dacă nu cumva deja există emailul
  // exec() este necesar pentru a promisifica
  User.find({ email: req.body.email })
    .exec()
    .then( user => {
      if (user.length >= 1) {
        return res.json({
          message: "există deja acest email în bază"
        });
      } else {
        // abia dacă emailul nu există, se va face hashingul  
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.json({
              error: err
            }); // dacă hashingul a reușit, vom încărca modelul cu date
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            // s-a constituit obiectul, salvează-l în bază
            user
              .save()
              .then(result => {
                console.log(result);
                res.json({
                  message: "Am creat utilizatorul"
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

// LOGHEAZĂ UTILIZATORUL
exports.user_login = (req, res, next) => {
  // caută în baza de date pentru un email
  User.find({ email: req.body.email })
    .exec()
    .then (user => {
      // obiectul user este primit dacă a fost identificat emailul
      if (user.length < 1) {
        return res.json({
          message: "Autentificarea a eșuat"
        });
      };
      // compară tokenul primit si execută callback-ul
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.json({
            message: "Autentificarea a eșuat"
          });
        };
        // dacă avem obiectul rezultat există
        // înseamnă că emailul și parola corespund
        if (result) {
          // generează un token semnat cu o perioadă de expirare
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
          // trimite tokenul către browser înapoi
          return res.json({
            message: "Autentificare reușită",
            token: token
          });
        };
        // dacă nu avem un corespondent în bază
        res.json({
          message: "Autentificare eșuată"
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

// ȘTERGE UTILIZATOR
exports.user_delete = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.json({
        message: "Am șters utilizatorul"
      });
    })
    .catch(err => {
      console.log(err);
      res.json({
        error: err
      });
    });
};
