const express = require('express');
const bcrypt = require('bcrypt');

const app = express();
const con = require('./db');

app.use(express.json());

app.listen(3000,()=>{
    console.log('sever is running EZ')
})