const express = require('express');
const { getallproducts, createproduct, updateproduct, detailproduct, deleteproduct } = require('../controllers/productControllers');
const { loginOnly, adminRole } = require('../middleware/adminAccess');
const Router = express.Router();




// route to create a product -- admin
Router.route('/createproduct').post(loginOnly, adminRole("admin"), createproduct);

//route for get all products
Router.route('/products').get(getallproducts);

//route for update product -- admin
Router.route('/updateproduct/:id').put(loginOnly, adminRole("admin"), updateproduct);

//route for detail product
Router.route('/detailproduct/:id').get(detailproduct);


//route for delete product -- admin
Router.route('/deleteproduct/:id').delete(loginOnly, adminRole("admin"), deleteproduct);

module.exports = Router