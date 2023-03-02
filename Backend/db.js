const mysql = require("mysql2");
// const obj = {
//     host:'175.178.232.232',
//     user:"pet-app",
//     password:"s6MXYZaEEd7JNXnN",
//     database:"pet-app",
//     port:3306,
//     multipleStatements: true,
// };
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