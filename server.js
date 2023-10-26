//server.js
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./Database/mongodbConfig');
const routes = require('./Routes/routes');
require('dotenv').config(); 

const app = express();

connectDB();

app.use(bodyParser.json());

const PORT = process.env.PORT || 4000; 

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}/`);
});
