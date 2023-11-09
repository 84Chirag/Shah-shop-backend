const Users = require('../models/userModel');
const validator = require('validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require('../utils/forgotPasswordMail');
const crypto = require("crypto");


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
            expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
        };
        const token = user.getJWTToken();
        return res.status(200).cookie("token", token, options).json({
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
            expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
        };
        const token = user.getJWTToken();
        return res.status(200).cookie("token", token, options).json({
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
exports.logout = async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        });
        return res.status(200).json({
            success: true,
            message: "You Have Been Successfully Logged Out!"
        });
    } catch (error) {
        console.log("there is some internal server error", error, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// for forgot passwords 
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

// reset password
exports.resetpassword = async(req,res) => {
    try {
        // hashing the generated token using crypto
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
        const user = await Users.findOne({
            resetPasswordToken,
            resetPasswordExpire:{$gt:Date.now()}
        });
        if (!user) {
            return res.status(400).json({
                success:false,
                message:"Invalid Token Or Token Has Been Expired"
            });
        };
        if (req.body.newpassword !== req.body.confirmpassword) {
            return res.status(400).json({
                success:false,
                message:"New Password and Confirm Password Does Not Match"
            });
        };
        user.password = req.body.newpassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        const token = await user.getJWTToken();
        const options = {
            expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
        };

        res.status(200).cookie("token", token, options).json({
            success: true,
            token
        })
    } catch (error) {
        console.log("there is some internal server error", error.message);
        if (error.name === "CastError") {
            const message = `Resource not Found. Invalid: ${error.path}`;
            return res.status(400).json({ message });
        }
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: `please enter valid ${error.message}`
            })
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// user details
exports.userdetail = async (req, res) => {
    try {
        const user = await Users.findById(req.user.id);
        // console.log(user);
        return res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.log("there is some internal server error", error, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// update user profile
exports.updateuser = async (req, res) => {
    try {
        const updatebody = {
            // to do of avatar or profile picture
            name: req.body.name,
            email: req.body.email,
        }
        // we are using req.user.id instead of req.body.id cause only login user can access this route 
        // for further detail check adminAcess in middleware folder
        const updateUser = await Users.findByIdAndUpdate(req.user.id, updatebody, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        res.status(200).json({
            success: true,
        })
    } catch (error) {
        console.log("there is some internal server error", error.message);
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: `please enter valid ${error.message}`
            })
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// update user passwod
exports.updatepassword = async (req, res) => {
    try {
        const user = await Users.findById(req.user.id).select("+password");

        const comparepassword = await bcrypt.compare(req.body.oldpassword, user.password);
        if (!comparepassword) {
            return res.status(400).json({
                success: false,
                message: "Enter Valid Password"
            });
        };
        if (req.body.newpassword !== req.body.confirmpassword) {
            return res.status(400).json({
                success: false,
                message: "new and confirm password doees not match"
            });
        };
        // hasing new password before updating password in database
        const newPassword = await bcrypt.hash(req.body.newpassword, 10);
        await Users.findByIdAndUpdate(req.user.id,{password:newPassword})
        const token = await user.getJWTToken();
        res.status(200).json({
            success: true,
            user,
            token
        })
    } catch (error) {
        console.log("there is some internal server error", error.message);
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: `please enter valid ${error}`
            })
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// All users detail -- admin route
exports.allUsersProfile = async(req,res) => {
    try {
        const user = await Users.find();
        res.status(200).json({
            success:true,
            user
        })
    } catch (error) {
        console.log("there is some internal server error", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// one users detail -- admin route
exports.oneUsersProfile = async(req,res) => {
    try {
        const user = await Users.findById(req.params.id);
        if (!user) {
            return res.status(200).json({
                success:false,
                message:"please Enter Valid User Id"
            })
        }
        res.status(200).json({
            success:true,
            user
        })
    } catch (error) {
        console.log("there is some internal server error", error.message);
        if (error.name === "CastError") {
            const message = `Resource not Found. Invalid: ${error.path}`;
            return res.status(400).json({ message });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// update user profile -- admin route
exports.adminupdateuser = async (req, res) => {
    try {
        const updatebody = {
            // to do of avatar or profile picture
            name: req.body.name,
            email: req.body.email,
            role: req.body.role
        }
        const user = await Users.findById(req.params.id);
        if (!user) {
            return res.status(400).json({
                success:false,
                message:'please Enter valid id'
            })
        }
        const updateUser = await Users.findByIdAndUpdate(req.params.id, updatebody, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        res.status(200).json({
            success: true,
            updateUser
        })
    } catch (error) {
        console.log("there is some internal server error", error.message);
        if (error.name === "CastError") {
            const message = `Resource not Found. Invalid: ${error.path}`;
            return res.status(400).json({ message });
        }
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: `please enter valid ${error.message}`
            })
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// delete user profile -- admin route
exports.admindeleteuser = async (req,res) => {
    try {
        const userid = await Users.findById(req.params.id);
        if (!userid) {
            return res.status(400).json({
                success:false,
                message:"User Does not Exists"
            });
        };
        const user = await Users.findByIdAndRemove(req.params.id);
        res.status(200).json({
            success:true,
            message:"User has been successfully Deleted",
            user
        });
    } catch (error) {
        console.log("there is some internal server error", error.message);
        if (error.name === "CastError") {
            const message = `Resource not Found. Invalid: ${error.path}`;
            return res.status(400).json({ message });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}