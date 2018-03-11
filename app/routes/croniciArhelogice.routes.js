/**
 * Realizarea rutelor API-ului
 * Dependințe: express, mongoose, modelul de cronică
 */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Cronica = require('../models/croniciArheologice.model');

// GET
router.get('/', (req, res, next) => {
    Cronica.find().exec().then( cronici => {
        console.log(cronici);
        res.json(cronici);
    }).catch(err => {
        console.log(err);
        res.json({eroarea: err})        
    });
    res.json({
        mesaj: 'fac GET pe /cronici'
    });
});

// GET cu id
router.get('/:caId', (req, res, next) => {
    const id = req.params.caId;
    Cronica.findById(id).exec().then(doc => {
        console.log(doc); 
        res.json({doc});       
    }).catch(err => {
        console.log(err);
        res.json({error: err});
    });
});

// POST
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
    cronica.save().then(result => {
        console.log(result);        
    }).catch(err => {
        console.log(err);
    });
    res.json({
        mesaj: 'fac POST pe /cronici',
        amCreeatCronica: cronica
    });
});

// gestionează cererile cu POST
router.post('/:caId', (req, res, next) => {

});

// gestionează cererile pe PATCH
router.patch('/:caId', (req, res, next) => {
    const id = req.param.caId;
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
router.delete('/:caId', (req, res, next) => {
    const id = req.params.caId;
    Product.remove({id}).then(result => {
        res.json(result);
    }).catch(err => {
        res.json({error: err.message});
    }); // șterge toare înregistrările cu acest id
});

module.exports = router;