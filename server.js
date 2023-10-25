const express = require('express')
const cors = require('cors');
const app = express()
const {db}= require('./Database/databaseConfig')

require('dotenv').config()


const PORT = process.env.PORT||6000;
app.use(express.json())
app.use(cors())


const server=()=>{
    db();
app.listen(PORT,()=>{
    console.log(`Server is Running on PORT:http://localhost:${PORT}`);
});
}
server();