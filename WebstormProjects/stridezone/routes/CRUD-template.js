/**
 * Created by ronal on 1/21/2017.
 */
/**
 * Created by ronal on 1/21/2017.
 */
//create, read, update and delete
var express = require('express');
var router = express.Router();
var Game = require('../lib/models/Game.js');

// START NEW CRUD //
// GET /events
// "Show all events"
router.get('/', function (req, res) {

});

// GET /events/create
// "Show page to create new event"
router.get('/create', function (req, res) {

});

// GET /events/:id
// "Show a single event"
router.get('/:id', function (req, res) {

});

// POST /events
// "Form post to create event"
router.post('/', function (req, res) {

});

// GET /events/:id/edit
// "Show page to edit an event"
router.get('/:id/edit', function (req, res) {

});
// PUT/PATCH /events/:id
// "Update server with changes"
router.put('/:id', function (req, res) {

});

// DELETE /events/:id
// "Delete the record"
router.delete('/:id', function (req, res) {

});

module.exports = router;