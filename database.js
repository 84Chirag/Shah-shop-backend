const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path:"./config/config.env"});

const mongoUrl = (process.env.DB_URI);// cannot use 'localhost' i.e.,('mongodb://localhost:27017/Ecommerce') will give error => ('connecton failed: MongooseServerSelectionError: connect ECONNREFUSED ::1:27017')

const connecttodb = () => {
    mongoose.connect(mongoUrl).then(() => {
        console.log('connection succesful');
    }).catch((error) => {
        console.log('connecton failed:', error)
    })
}
// connecttodb();
module.exports = connecttodb;