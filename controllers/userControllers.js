const Users = require('../models/userModel');
const validator = require('validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// Register Or signup of user
exports.signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // to get all data and handle error for missing data
        if (!name || !email || !password) {
            return res.status(404).json({
                success: false,
                message: "Please Provide All Details"
            });
        };
        // validation check for email and error handling in if not cases
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address.",
            });
        }
        // validation check for passwords and error handling in if not cases
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password should have at least 8 characters.",
            });
        };
        // to check if there's already a email exist
        const existingemail = await Users.findOne({ email });
        if (existingemail) {
            return res.status(400).json({
                success: false,
                message: "User With This Email Exists"
            });
        };
        // passing all conditions create a user in database
        const user = await Users.create({
            name,
            email,
            password,
            avatar: {
                public_id: "sample id",
                url: "sample url"
            }
        });

        const token = user.getJWTToken();
        return res.status(200).json({
            success: true,
            token
        });
    } catch (error) {
        console.log("there is some internal server error", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// Login of user 
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email, !password) {
            return res.status(404).json({
                success: false,
                message: "Please Provide Email and Password"
            });
        };
        const user = await Users.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        };
        const comparepassword = await bcrypt.compare(password, user.password);
        if (!comparepassword) {
            return res.status(401).json({
                success: false,
                message: "Enter Valid and Password"
            });
        };
        const token = user.getJWTToken();
        return res.status(200).json({
            success: true,
            token
        })
    } catch (error) {
        console.log("there is some internal server error", error, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}