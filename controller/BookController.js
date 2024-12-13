const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const getBooks = (req, res) => {
  const { category } = req.query;

  if (category === undefined) {
    const sql = "SELECT * FROM books";

    conn.query(sql, (err, results) => {
      res.status(StatusCodes.OK).json(results);
    });

    return;
  }

  const sql = "SELECT * FROM books WHERE category_id = ?";

  conn.query(sql, category, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    res.status(StatusCodes.OK).json(results);
  });
};

const getBook = (req, res) => {
  res.json("도서 개별 조회");
};

module.exports = { getBooks, getBook };
