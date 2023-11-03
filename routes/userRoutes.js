const express = require('express');
const { signupUser, loginUser } = require('../controllers/userControllers');
const Router = express.Router();

// route for register or signup of user
Router.route('/signup').post(signupUser);

// route for login of user
Router.route('/login').post(loginUser);







module.exports = Router;