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


const server = app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`)
})

// unhandled promise rejection
process.on("unhandledRejection", (error)=>{
  console.log(`Error: ${error.message}`);
  console.log(`shutting down server due to unhandled promise rejection`);
  server.close(()=>{
    process.exit(1);
  });
});

// connection to database
connecttodb();