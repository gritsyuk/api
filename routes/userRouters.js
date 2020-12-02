const express = require('express');
const authControllers = require('../controllers/authController');

const routs = express.Router();

routs.route('/signup').post(authControllers.signup);
routs.route('/login').post(authControllers.login);

routs.route('/forgotPassword').post(authControllers.forgotPassword);
routs.patch('/resetPassword/:token').post(authControllers.resetPassword);

module.exports = routs;