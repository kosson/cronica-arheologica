const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Preloader = require('../models/preloadere.model');

// gestionează cererile pe GET
router.get('/', (req, res, next) => {
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
    // res.json({
    //     mesaj: 'fă GET pe /preloadere și adu-mi totul'
    // });
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
    res.sendStatus(200).json({
        mesaj: 'înregistrare preloader actualizată'
    });
});

// gestionează cererile pe DELETE
router.delete('/:preloaderId', (req, res, next) => {
    res.sendStatus(200).json({
        mesaj: 'înregistrare preloader eliminată'
    });
});

module.exports = router;