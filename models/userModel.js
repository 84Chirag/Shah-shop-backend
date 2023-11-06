const mongoose = require('mongoose');
const validator = require('validator');
const dotenv = require('dotenv');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


// CONFIG'S
dotenv.config({ path: "../config/config.env" });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please Enter Name"],
        maxLength: [30, "name cannot exceed 30 characters"],
        minLength: [4, "name should have more than 4 characters"]
    },
    email: {
        type: String,
        required: [true, "please Enter Products description"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a Valid Email"]
    },
    password: {
        type: String,
        required: [true, "please Enter Products price"],
        minLength: [8, "name should have more than 8 characters"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user",
        required: true
    },

    resetPasswordToken: String,

    resetPasswordExpire: Date,

    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

userSchema.methods.getPasswordResetToken = function(){
    // generating token using crypto
    const resettoken = crypto.randomBytes(20).toString("hex");
    // hashing the generated token using crypto
    this.resetPasswordToken = crypto.createHash("sha256").update(resettoken).digest("hex");
    
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resettoken
}

module.exports = mongoose.model("Users", userSchema);