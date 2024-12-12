const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "bookstore",
  dateStrings: true,
});

module.exports = connection;
