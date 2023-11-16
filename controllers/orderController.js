const Product = require('../models/productsModel');
const Order = require('../models/orderModel');
// const Users = require('../models/userModel');
// const mongoose = require('mongoose');


// to check all orders -- admin route
exports.allOrder = async (req, res) => {
    try {
        const orders = await Order.find();
        // to check total amount of all order
        let totalAmount = 0;
        orders.forEach(order => {
            totalAmount += order.totalPrice
        });
        return res.status(200).json({
            success: true,
            totalAmount,
            orders
        });
    } catch (error) {
        console.error("Error finding order:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later."
        });
    }
}

// to create a order
exports.createOrder = async (req, res) => {
    try {
        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            itemPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        } = req.body;
        if (!shippingInfo || !orderItems || !paymentInfo || !itemPrice || !taxPrice || !shippingPrice || !totalPrice) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required information for the order."
            });
        }
        const order = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            itemPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt: Date.now(),
            user: req.user._id
        });
        res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        if (error.name === "ValidationError") {
            // Handle the specific cast error here
            return res.status(400).json({
                success: false,
                message: "Invalid data format."
            });
        }
        if (error.name === "CastError") {
            // Handle the specific cast error here
            return res.status(400).json({
                success: false,
                message: `Invalid Id format of Order Id or Error message: ${error.message}`
            });
        }
        // Mongoose might throw a MongoError with the code 11000 if there's a violation. You can handle this by checking if error.code === 11000.
        if (error.code === 11000) {
            // Handle unique constraint violation
            return res.status(400).json({
                success: false,
                message: "Duplicate key error. A resource with the same key already exists."
            });
        }
        console.error("Error creating order:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later."
        });
    }
}

// to my check order 
exports.myOrder = async (req, res) => {
    try {
        const order = await Order.find({ user: req.user.id })
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "No orders found for this user."
            });
        }
        res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        if (error.name === "CastError") {
            console.error("CastError:", error);
            // Handle the specific cast error here
            return res.status(400).json({
                success: false,
                message: `Invalid Id format of Order Id or Error message: ${error.message}`
            });
        }
        // Mongoose might throw a MongoError with the code 11000 if there's a violation. 
        // You can handle this by checking if error.code === 11000.
        if (error.code === 11000) {
            // Handle unique constraint violation
            return res.status(400).json({
                success: false,
                message: "Duplicate key error. A resource with the same key already exists."
            });
        }
        console.error("Error creating order:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later."
        });
    }
}

// to get single order 
exports.singleOrder = async (req, res) => {
    try {
        // req.params.id is id of order i.e., _id
        const order = await Order.findById(req.params.id).populate("user", "name email")
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found with this Id"
            });
        };
        res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        if (error.name === "CastError") {
            // Handle the specific cast error here
            return res.status(400).json({
                success: false,
                message: `Invalid Id format of Order Id or Error message: ${error.message}`
            });
        }
        // Mongoose might throw a MongoError with the code 11000 if there's a violation. 
        // You can handle this by checking if error.code === 11000.
        if (error.code === 11000) {
            // Handle unique constraint violation
            return res.status(400).json({
                success: false,
                message: "Duplicate key error. A resource with the same key already exists."
            });
        }
        console.error("Error creating order:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later."
        });
    }
}

// to update order 
exports.updateOrder = async (req, res) => {
    try {
        // req.params.id is id of order i.e., _id
        const order = await Order.findById(req.params.id)
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found with this Id"
            });
        };
        if (Order.orderStatus === "Delivered") {
            return res.status(400).json({
                success: false,
                message: "order has been already Delivered"
            });
        };
        // update stock in products model on updation of status to delivered
        order.orderItems.forEach(async (order) => {
            await updateStock(order.productId, order.quantity)
        });
        order.orderStatus = req.body.status;
        if (req.body.status === "Delivered") {
            order.deliveredAt = Date.now();
        };
        await order.save({ validateBeforeSave: false });
        res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        if (error.name === "CastError") {
            // Handle the specific cast error here
            return res.status(400).json({
                success: false,
                message: `Invalid Id format of Order Id or Error message: ${error.message}`
            });
        }
        // Mongoose might throw a MongoError with the code 11000 if there's a violation. 
        // You can handle this by checking if error.code === 11000.
        if (error.code === 11000) {
            // Handle unique constraint violation
            return res.status(400).json({
                success: false,
                message: "Duplicate key error. A resource with the same key already exists."
            });
        }
        console.error("Error creating order:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later."
        });
    }
}

// this function is created to update product stock on order updation
async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.stock = product.stock - quantity;

    await product.save({ validateBeforeSave: false });
}

// to delete order -- admin route
exports.deleteOrder = async (req, res) => {
    try {
        const orderid = await Order.findById(req.params.id);
        if (!orderid) {
            return res.status(400).json({
                success: false,
                message: "order with this id does not exists"
            });
        };
        const order = await Order.findByIdAndRemove(orderid);
        return res.status(200).json({
            success: true,
        });
    } catch (error) {
        if (error.name === "CastError") {
            // Handle the specific cast error here
            return res.status(400).json({
                success: false,
                message: `Invalid Id format of Order Id or Error message: ${error.message}`
            });
        }
        // Mongoose might throw a MongoError with the code 11000 if there's a violation. 
        // You can handle this by checking if error.code === 11000.
        if (error.code === 11000) {
            // Handle unique constraint violation
            return res.status(400).json({
                success: false,
                message: "Duplicate key error. A resource with the same key already exists."
            });
        }
        console.error("Error finding order:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later."
        });
    }
}