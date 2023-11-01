// product model
const Product = require('../models/productsModel')
let success = false;


// controller to check all products
exports.getallproducts = async (req, res) => {
    try {
        const product = await Product.find();
        return res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        if (error.name === "CastError") {
            const message = ` Resource not Found. Invalid: ${error.path}`;
            return res.status(400).json({message});
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
        const productData = await req.body;
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
        if (error.name === "CastError") {
            const message = ` Resource not Found. Invalid: ${error.path}`;
            return res.status(400).json({message});
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
        if (error.name === "CastError") {
            const message = ` Resource not Found. Invalid: ${error.path}`;
            return res.status(400).json({message});
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
        if (error.name === "CastError") {
            const message = ` Resource not Found. Invalid: ${error.path}`;
            return res.status(400).json({message});
        }
        console.log("there is some internal server error", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};