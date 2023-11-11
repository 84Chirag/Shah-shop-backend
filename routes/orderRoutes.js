const express = require('express');
const Router = express.Router();
const { loginOnly, adminRole } = require('../middleware/adminAccess');
const { createOrder, allOrder, myOrder, singleOrder, updateOrder } = require('../controllers/orderController');


// to get all orders -- admin route
Router.route('/orders/allorder').get(loginOnly,adminRole("admin"),allOrder);

// to update order status -- admin route
Router.route('/orders/updateorder/:id').put(loginOnly,adminRole("admin"),updateOrder);

// to get my orders -- user route 
Router.route('/order/:id').get(loginOnly,adminRole("admin"),singleOrder);

// to get my orders -- user route
Router.route('/orders/myorder').get(loginOnly,myOrder);

// Don't give same url like this you will get error instead do it like above 
// I was getting error for this if anybody knows the further detail of error or exact reason please add a comment here
// Router.route('/orders/:id').get(singleOrder);
// Router.route('/orders/myorder').get(loginOnly,myOrder);

// route to create order -- user route
Router.route('/orders/createorder').post(loginOnly,createOrder);


module.exports = Router;