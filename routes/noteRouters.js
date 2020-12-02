const express = require('express');
const notesController = require('../controllers/notesController');
const authController = require('../controllers/authController');

const routs = express.Router();

routs
  .route('/')
  .get(authController.protect, notesController.getAllNotes)
  .post(notesController.addNote);

routs
  .route('/:id')
  .get(notesController.getNote)
  .patch(notesController.updateNote)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    notesController.deleteNote
    );

module.exports = routs;