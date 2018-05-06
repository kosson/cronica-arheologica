const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Preloader = require('../models/preloadere.model');
const checkAuth = require('../controllers/checkAuth.controller');

// TODO: Explorează posibilitatea de a încărca preloaderele în localStorage

// gestionează cererile pe GET
router.get('/', checkAuth, (req, res, next) => {
    Preloader
    .find()
    .exec()
    .then(preloadere => {
        // console.log(preloadere);
        res.json(preloadere);
    }).catch((err) => {
        // console.log(err);
        res.json({eroarea: err})
    });
});

// gestionează cererile GET cu id
router.get('/:preloaderId', (req, res, next) => {
    const id = req.params.preloaderId;
    Preloader.findById(id).exec().then(doc => {
        console.log(doc); 
        if (doc) {
            res.json({doc});  
        } else {
            res.json({
                mesaj: "Nu am resursa... plângi!"
            });
        }
    }).catch(err => {
        console.log(err);
        res.json({error: err});
    });
});

// gestionează cererile cu POST
router.post('/', (req, res, next) => {
    // incarca modelul cu date din body
    const preloader = new Preloader({
        _id: new mongoose.Types.ObjectId(),
        anulAdoptarii: req.body.anulAdoptarii,
        prinAct: req.body.prinAct,
        tipuriSit: req.body.tipuriSit,
        listaEpoci: req.body.listaEpoci
    });
    preloader.save().then(result => {
        console.log(result);        
    }).catch(err => {
        console.log(err);
    });
    res.json({
        mesaj: 'fac POST pe /preloadere',
        amCreatPreloader: preloader
    });
});

// gestionează cererile cu POST
router.post('/:preloaderId', (req, res, next) => {

});

// gestionează cererile pe PATCH
router.patch('/:preloaderId', (req, res, next) => {
    const id = req.param.preloaderId;
    const updOps = {};
    for (let [key, value] of Object.entries(req.body)){
        // console.log(key, value);
        updOps[key] = value;
    }
    Product.update({id}, { 
        $set: updOps
    }).then(result => {
        res.json({result});
    }).catch(err => {
        res.json({message: err.message});
    });
});

// gestionează cererile pe DELETE
router.delete('/:preloaderId', (req, res, next) => {
    const id = req.params.preloaderId;
    Product.remove({id}).then(result => {
        res.json(result);
    }).catch(err => {
        res.json({error: err.message});
    }); // șterge toare înregistrările cu acest id
});

module.exports = router;