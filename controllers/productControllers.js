// product model
const Product = require('../models/productsModel');
const ApiFeatures = require('../utils/apifeatures');
let success = false;


// controller to check all products
exports.getallproducts = async (req, res) => {
    try {
        const resultPerPage = 5;
        const productCount = await Product.countDocuments();

        const ApiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);
        const product = await ApiFeature.query;
        return res.status(200).json({
            success: true,
            product,
            productCount
        });
    } catch (error) {
        // for cast Error
        if (error.name === "CastError") {
            const message = `Resource not Found. Invalid: ${error.path}`;
            return res.status(400).json({ message });
        }
        // mongoose duplicate key error
        if (error.code === 11000) {
            const message = `Duplicate ${Object.keys(error.keyValue)} Entered`;
            return res.status(400).json({ message });
        }
        //  wrong jwt error
        if (error.name === "JsonWebTokenError") {
            const message = `Json Web Token Is Invalid, Try Again`;
            return res.status(400).json({ message });
        }
        // for web token expired error
        if (error.name === "TokenExpiredError") {
            const message = `Json Web token is expired, try Again`;
            return res.status(400).json({ message });
        }
        console.log("there is some internal server error", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

//controller to create a product -- only admin
exports.createproduct = async (req, res) => {
    try {
        // setting user as user id check productmodel for reference
        req.body.user = req.user.id
        const productData = await req.body;
        // validation check error handler
        if (!productData.name || !productData.description || !productData.price || !productData.image.public_id || !productData.image.url || !productData.category) {
            return res.status(400).json({
                success: false,
                message: "Please Provide Product's Full Deatils"
            })
        }
        const product = await Product.create(productData);

        return res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        console.log("there is some internal server error", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// controller to update a product -- only admin
exports.updateproduct = async (req, res) => {
    try {
        let id = await Product.findById(req.params.id);
        if (!id) {
            return res.status(404).json({
                success: false,
                message: "product not found"
            })
        };
        let product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        return res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        // for cast Error
        if (error.name === "CastError") {
            const message = `Resource not Found. Invalid: ${error.path}`;
            return res.status(400).json({ message });
        }
        // mongoose duplicate key error
        if (error.code === 11000) {
            const message = `Duplicate ${Object.keys(error.keyValue)} Entered`;
            return res.status(400).json({ message });
        }
        //  wrong jwt error
        if (error.name === "JsonWebTokenError") {
            const message = `Json Web Token Is Invalid, Try Again`;
            return res.status(400).json({ message });
        }
        // for web token expired error
        if (error.name === "TokenExpiredError") {
            const message = `Json Web token is expired, try Again`;
            return res.status(400).json({ message });
        }
        console.log("there is some internal server error", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

//controller for delete product -- only admin
exports.deleteproduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "product not found"
            });
        };
        product = await Product.findByIdAndRemove(req.params.id);

        return res.status(200).json({
            success: true,
            message: "product has been successfully Removed"
        });
    } catch (error) {
        // for cast Error
        if (error.name === "CastError") {
            const message = `Resource not Found. Invalid: ${error.path}`;
            return res.status(400).json({ message });
        }
        // mongoose duplicate key error
        if (error.code === 11000) {
            const message = `Duplicate ${Object.keys(error.keyValue)} Entered`;
            return res.status(400).json({ message });
        }
        //  wrong jwt error
        if (error.name === "JsonWebTokenError") {
            const message = `Json Web Token Is Invalid, Try Again`;
            return res.status(400).json({ message });
        }
        // for web token expired error
        if (error.name === "TokenExpiredError") {
            const message = `Json Web token is expired, try Again`;
            return res.status(400).json({ message });
        }
        console.log("there is some internal server error", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    };
};

// controller for full details of a single product
exports.detailproduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "product not found"
            });
        };
        return res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        // for cast Error
        if (error.name === "CastError") {
            const message = `Resource not Found. Invalid: ${error.path}`;
            return res.status(400).json({ message });
        }
        // mongoose duplicate key error
        if (error.code === 11000) {
            const message = `Duplicate ${Object.keys(error.keyValue)} Entered`;
            return res.status(400).json({ message });
        }
        //  wrong jwt error
        if (error.name === "JsonWebTokenError") {
            const message = `Json Web Token Is Invalid, Try Again`;
            return res.status(400).json({ message });
        }
        // for web token expired error
        if (error.name === "TokenExpiredError") {
            const message = `Json Web token is expired, try Again`;
            return res.status(400).json({ message });
        }
        console.log("there is some internal server error", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};