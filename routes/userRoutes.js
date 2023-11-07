const express = require('express');
const { signupUser, loginUser, logout, forgotpassword, userdetail, updateuser, updatepassword } = require('../controllers/userControllers');
const { loginOnly } = require('../middleware/adminAccess');
const Router = express.Router();

// route for register or signup of user
Router.route('/signup').post(signupUser);

// route for login of user
Router.route('/login').post(loginUser);

// route for log out of user
Router.route('/logout').get(logout);

// route for forgot password
// Router.route('/password/forgot').post(forgotpassword);

// route for user profile 
Router.route('/profile').get(loginOnly, userdetail);

// route for update user profile
Router.route('/profile/updateprofile').put(loginOnly, updateuser);

// route for update user password
Router.route('/profile/updatepassword').put(loginOnly, updatepassword);





module.exports = Router;