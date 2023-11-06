const express = require('express');
const { signupUser, loginUser, logout, forgotpassword } = require('../controllers/userControllers');
const Router = express.Router();

// route for register or signup of user
Router.route('/signup').post(signupUser);

// route for login of user
Router.route('/login').post(loginUser);

// route for log out of user
Router.route('/logout').get(logout);

// route for forgot password
// Router.route('/password/forgot').post(forgotpassword);







module.exports = Router;