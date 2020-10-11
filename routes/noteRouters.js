const express = require('express');
const notesControllers = require('../controllers/notesController');

const routs = express.Router();

routs.route('/').get(notesControllers.getAllNotes).post(notesControllers.addNote);
routs.route('/:id').get(notesControllers.getNote).patch(notesControllers.updateNote);

module.exports = routs;