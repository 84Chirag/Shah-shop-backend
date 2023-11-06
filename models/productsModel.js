const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please Enter Products Name"]
    },
    description: {
        type: String,
        required: [true, "please Enter Products description"]
    },
    price: {
        type: Number,
        required: [true, "please Enter Products price"],
        maxLength: [8, "Price cannnot exceed 8 characters"]
    },
    image: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    stock: {
        type: Number,
        required: [true, "please Enter product Stock"],
        maxLength: [4, "stock cannot Exceed 4 characters"],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model("products", productSchema);