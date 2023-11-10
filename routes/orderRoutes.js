const express = require('express');
const Router = express.Router();
const { loginOnly, adminRole } = require('../middleware/adminAccess');
const { createOrder, allOrder, myOrder, singleOrder } = require('../controllers/orderController');


// to get all orders -- admin route
Router.route('/orders/allorder').get(loginOnly,adminRole("admin"),allOrder);

// to get my orders -- user route (to do later)
// Router.route('/orders/:id').get(singleOrder);

// to get my orders -- user route
Router.route('/orders/myorder').get(loginOnly,myOrder);

// route to create order -- user route
Router.route('/orders/createorder').post(loginOnly,createOrder);


module.exports = Router;