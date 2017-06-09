/**
 * Created by ronal on 5/19/2017.
 */
var express = require('express');
var router = express.Router();
var Deck = require('../lib/models/Deck.js');
var mongoose = require('mongoose');

router.get('/', function(req, res, next){
   res.render('meta_game/index')
});

router.get('/decks/', function (req, res, next){
    Deck.find(function (err, deck){
        if (err){
            throw err;
        }
    });
   res.render('meta_game/decks');
});

router.get('/decks/create', function (req, res) {
    var deck = new Deck();
    res.render('meta_game/add', {
        decks: deck
    });
    console.log('is created!')
});

router.post('/decks/create', function(req, res, next){
    Deck.create(req.body, function (err, deck){
        if (err){
            throw err;
        }
        req.flash("success", "Successfully posted!");
        res.redirect('index');
    });
});

module.exports = router;