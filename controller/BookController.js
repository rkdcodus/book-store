const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const getBooks = (req, res) => {
  const querySize = Object.keys(req.query).length;
  const { category, news } = req.query;
  let sql =
    "SELECT books.id, category as category, title, form, author, isbn, pages, summary, detail, contents, price, pub_date, img FROM bookstore.books LEFT OUTER JOIN categories ON books.category_id = categories.id ";

  if (!querySize) {
    conn.query(sql, (err, results) => {
      res.status(StatusCodes.OK).json(results);
    });

    return;
  }

  let sqlQuery = [];

  if (category) sqlQuery.push("books.category_id = ? ");
  if (news) sqlQuery.push("pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW() ");

  sql += "where " + sqlQuery.join("and ");

  conn.query(sql, category, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    res.status(StatusCodes.OK).json(results);
  });
};

const getBook = (req, res) => {
  const { bookId } = req.params;
  const sql =
    "SELECT books.id, category as category, title, form, author, isbn, pages, summary, detail, contents, price, pub_date, img FROM bookstore.books LEFT OUTER JOIN categories ON books.category_id = categories.id WHERE books.id = ?";

  conn.query(sql, bookId, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (!results.length) {
      return res.status(StatusCodes.NOT_FOUND).end();
    }

    res.status(StatusCodes.OK).json(results);
  });
};

module.exports = { getBooks, getBook };
