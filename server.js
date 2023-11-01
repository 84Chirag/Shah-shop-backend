const express = require('express');
const connecttodb = require('./database');
const dotenv = require('dotenv');
const app = express();

app.use(express.json());

// CONFIG'S
dotenv.config({path:"./config/config.env"});

//endpoints 
const products = require('../backend/routes/productRoutes')
app.use('/api/v1',products)


app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`)
})

// connection to database
connecttodb();