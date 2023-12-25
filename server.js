const express = require('express');
const connecttodb = require('./database');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bodyParser =require('body-parser');
const cloudinary = require('cloudinary');
const fileUpload = require('express-fileupload');
const cors = require('cors')
const app = express();

// handling uncaught exception error
// if there's any uncaught error in server it will be handled here and 
// server will closed with giving error message
process.on("uncaughtException", (error) => {
  console.log(`error: ${error.message}`);
  console.log(`shutting down server due to uncaught Exception error`);
  process.exit(1);
})

const corsOptions = {
  origin: ['https://jewellery-shop-gamma.vercel.app',],
  // origin: ['http://localhost:5173','https://jewellery-shop-gamma.vercel.app/'],
  credentials: true, // Enable credentials (cookies) in CORS
};

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());
app.use(cors(corsOptions));

// CONFIG'S
dotenv.config({ path: "./config/config.env" });

//endpoints 
const products = require('./routes/productRoutes')
app.use('/api/v1', products);
const users = require('./routes/userRoutes')
app.use('/api/v1', users);
const orders = require('./routes/orderRoutes');
app.use('/api/v1',orders);


const server = app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`)
});

// unhandled promise rejection for database 
//reason for mongodb .catch comment out in database.js
// if there is any error then instead of using .catch for error handling in connecttodb()
// we are closing the server and console.log the error's message
process.on("unhandledRejection", (error) => {
  console.log(`Error: ${error.message}`);
  console.log(`shutting down server due to unhandled promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});

// connection to database
connecttodb();

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET
});