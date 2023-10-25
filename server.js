// app.js
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./Database/mongodbConfig');
const routes = require('./Routes/routes');
require('dotenv').config(); // Load environment variables from .env

const app = express();

connectDB();

app.use(bodyParser.json());

const PORT = process.env.PORT || 3000; // Use the PORT environment variable

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
