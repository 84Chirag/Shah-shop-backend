const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Users = require('../models/userModel');

// CONFIG'S
dotenv.config({ path: "../config/config.env" });

exports.adminAccess = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        // console.log(token)
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid"
            })
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await Users.findById(decodedData.id);
        // console.log(req.user);
        next();

    } catch (error) {
        console.log("there is some internal server error", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

exports.adminRole = (...roles) =>{
    return (req,res,next)=>{
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success:false,
                message:`Role: ${req.user.role} is not allowed to access this resources`
            });
        };
        next();
    };
}