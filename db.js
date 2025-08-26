const db = require('mysql2');
const con = db.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'test'
})

module.exports = con;
