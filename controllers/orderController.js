const Product = require('../models/productsModel');
const Users = require('../models/userModel');
const Order = require('../models/orderModel');
const mongoose = require('mongoose');


// to check all orders -- admin route
exports.allOrder = async (req, res) => {
    try {
        const order = await Order.find();
        return res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        console.error("Error finding order:", error.message, error.path);
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
                message: "Invalid data format for productId in orderItems."
            });
        }
        if (error.name === "CastError") {
            // Handle the specific cast error here
            return res.status(400).json({
                success: false,
                message: "Invalid data format for productId in orderItems."
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
        console.error("Error creating order:", error.message, error.path);
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
                message: `Invalid data format for productId in orderItems.`
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
        console.error("Error creating order:", error.message, error.path);
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
        const order = await Order.findById(req.params.id).populate("user","name email")
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
                message: "Invalid data format for productId in orderItems."
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
        console.error("Error creating order:", error.message, error.path);
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
        const { orderStatus, deliveredAt} = req.body;
        if (!orderStatus || !deliveredAt) {
            return res.status(400).json({
                success:false,
                message:"Please Enter Required Data"
            });
        };
        const updatedorder = await Order.findByIdAndUpdate(req.params.id,{orderStatus,deliveredAt},{
            new: true,
            runValidators: true,
            useFindAndModify: false
        });
        res.status(200).json({
            success: true,
            updatedorder
        })
    } catch (error) {
        if (error.name === "CastError") {
            // Handle the specific cast error here
            return res.status(400).json({
                success: false,
                message: "Invalid data format for productId in orderItems."
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
        console.error("Error creating order:", error.message, error.path);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later."
        });
    }
}
