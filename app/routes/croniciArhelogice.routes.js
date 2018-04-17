const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Cronica = require('../models/croniciArheologice.model');

// GET localhost:8000/cronicile
router.get('/', (req, res, next) => {
    Cronica
        .find()
        .exec()
        .then( cronici => {
            res.json(cronici);
        }).catch( err => {
            res.json({err})        
        });
});

// GET localhost:8000/cronicile/5a9aa163f0b9330452e333e8
router.get('/:caId', (req, res, next) => {
    const id = req.params.caId;
    Cronica
        .findById(id)
        .exec()
        .then( doc => {
            res.json({doc});       
        }).catch( err => {
            res.json({error: err});
        });
});

// gestionează cererile cu POST
router.post('/', (req, res, next) => {    
    // Încarcă cu date modelul
    const cronica = new Cronica({
        _id: new mongoose.Types.ObjectId(),
        denumire: req.body.denumire,
        localitate: req.body.localitate,
        judet: req.body.judet,
        adresa: req.body.adresa,
        uat: req.body.uat,
        siruta: req.body.siruta,
        ran: req.body.ran,
        toponim: req.body.toponim,
        sector: req.body.sector,
        anul: req.body.anul,
        tipsit: req.body.tipsit,
        categoriesit: req.body.categoriesit,
        perioade: req.body.perioade,
        epoci: req.body.epoci,
        culturi: req.body.culturi,
        colectiv: req.body.colectiv,
        nrautorizatie: req.body.nrautorizatie,
        anautoriz: req.body.anautoriz,
        valcontract: req.body.valcontract,
        datainceperii: req.body.datainceperii,
        datafinalizarii: req.body.datafinalizarii,
        prezentaresit: req.body.prezentaresit,
        obiectivele: req.body.obiectivele,
        rezultateleinterpretare: req.body.rezultateleinterpretare,
        scurtadescriere: req.body.scurtadescriere,
        tehnicianaliza: req.body.tehnicianaliza,
        concluziirap: req.body.concluziirap,
        referintebibl: req.body.referintebibl,
        rezumat: req.body.rezumat,
        actualizat: req.body.actualizat        
    });
    // salvează datele în bază
    cronica
        .save()
        .then(result => {
            res.json(result); 
        }).catch(err => {
            res.json({error: err})
        });
});

// gestionează cererile cu POST
// router.post('/:caId', (req, res, next) => {
//     console.log(req.toValue());
// });

// gestionează cererile pe PATCH
router.patch('/:caId', (req, res, next) => {
    const id = req.param.caId;
    const updOps = {};
    
    // ia obiectul primit care este parțialul modificat al întregii înregistrări
    // și construiește un obiect de lucru pentru metoda update
    for (let [key, value] of Object.entries(req.body)) {
        updOps[key] = value;
    };

    Cronica
        .update( {id}, { 
            $set: updOps
        })
        .then(result => {
            res.json({result}); // întoarce întreaga înregistrare actualizată
        })
        .catch(err => {
            res.json({message: err.message});
        });
});

// gestionează cererile pe DELETE
router.delete('/:caId', (req, res, next) => {
    const id = req.params.caId;

    Cronica
        .remove({id})
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.json({error: err.message});
        });
});

module.exports = router;