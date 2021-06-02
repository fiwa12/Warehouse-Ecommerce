const mysql = require("mysql");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "usbw",
  database: "warehouse",
  port: 3307,
});

module.exports = db;
