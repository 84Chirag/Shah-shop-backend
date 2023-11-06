const Users = require('../models/userModel');
const validator = require('validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const sendEmail = require('../utils/forgotPasswordMail') //todo of forgot password


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

        const options = {
            expires : new Date(
                Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            httpOnly : true,
        };
        const token = user.getJWTToken();
        return res.status(200).cookie("token",token,options).json({
            success: true,
            user,
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
        const options = {
            expires : new Date(
                Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            httpOnly : true,
        };
        const token = user.getJWTToken();
        return res.status(200).cookie("token",token,options).json({
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


// Logout of users
exports.logout = async(req,res)=>{
    try {
        res.cookie("token",null,{
            expires:new Date(Date.now()),
            httpOnly:true
        });
        return res.status(200).json({
            success:true,
            message:"You Have Been Successfully Logged Out!"
        });
    } catch (error) {
        console.log("there is some internal server error", error, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// for forgot passwords (to do )
/*
exports.forgotpassword = async(req,res) => {
    const user = await Users.findOne({email:req.body.email});
    try {
        if (!user) {
            return res.status(404).json({
                success:false,
                message:"user does not Exit"
            });
        };
        const resetToken = user.getPasswordResetToken();

        await user.save({validateBeforeSave:false});
        const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
        const message = `your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this Email, please Ignore it.`
        await sendEmail({
            email: user.email,
            subject: `Ecommerce Website Password Reset Email`,
            message
        });
        res.status(200).json({
            success:true,
            Message:`Email has been sent to ${user.email} Succssfully`
        })
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        user.save({validateBeforeSave: false});
        console.log("there is some internal server error", error, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
*/