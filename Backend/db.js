const mysql = require("mysql2");
const obj = {
    host:'127.0.0.1',
    user:"root",
    password:"123456",
    database:"demo1",
    port:3306,
    multipleStatements: true,
};
const connection = mysql.createConnection(obj);
const connectPool = mysql.createPool(obj);
connection.connect();

module.exports={connection,connectPool};