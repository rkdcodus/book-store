const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const category = (req, res) => {
  const sql = "SELECT * FROM categories";

  conn.query(sql, (err, results) => {
    res.status(StatusCodes.OK).json(results);
  });
};

module.exports = { category };
