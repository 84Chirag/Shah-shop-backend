const express = require('express');
const connecttodb = require('./database')
const app = express();
const port = 80;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})

connecttodb();