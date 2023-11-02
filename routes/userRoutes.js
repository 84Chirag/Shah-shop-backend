const express = require('express');
const { signupUser } = require('../controllers/userControllers');
const Router = express.Router();

// route for register or signup of user
Router.route('/signup').post(signupUser);







module.exports = Router;