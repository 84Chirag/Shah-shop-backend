const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Users = require('../models/userModel');

// CONFIG'S
dotenv.config({ path: "../config/config.env" });

exports.loginOnly = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        // console.log(token)

        // if token is invalid sending message: please login
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "please Login"
            })
        }

        // decoding data using jwt verify
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        
        // using decodedata's id which is user id we are finding him in database
        req.user = await Users.findById(decodedData.id);
        // console.log(req.user);

        // we are taking userid from cookies and passing it to next function like below
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