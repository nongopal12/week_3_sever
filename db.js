const db = require('mysql2');
const con = db.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'db'
})

module.exports = con;
