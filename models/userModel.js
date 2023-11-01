const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please Enter Products Name"]
    },
    email: {
        type: String,
        required: [true, "please Enter Products description"]
    },
    password: {
        type: Number,
        required: [true, "please Enter Products price"],
        maxLength: [8, "Price cannnot exceed 8 characters"]
    },
    role:{
        type: String,
        default:"customer",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model("users", userSchema);