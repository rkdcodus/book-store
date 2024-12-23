const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const ensureAuthorization = require("./authorization");
const { TokenExpiredError } = require("jsonwebtoken");

const getBooks = (req, res) => {
  const querySize = Object.keys(req.query).length;
  const { category, news, limit, currentPage } = req.query;
  let sqlQuery = [];
  let sql =
    "SELECT *, (SELECT count(*) FROM likes WHERE book_id = books.id) AS likes FROM bookstore.books LEFT OUTER JOIN categories ON books.category_id = categories.category_id ";

  if (!querySize) {
    conn.query(sql, (err, results) => {
      res.status(StatusCodes.OK).json(results);
    });

    return;
  }

  if (category) sqlQuery.push(`books.category_id = ${category} `);
  if (news) sqlQuery.push("pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW() ");

  if (sqlQuery.length) sql += "where " + sqlQuery.join("and ");

  if (limit && currentPage) sql += `LIMIT ${+limit} OFFSET ${limit * (currentPage - 1)}`;

  conn.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    res.status(StatusCodes.OK).json(results);
  });
};

const getBook = (req, res) => {
  const { bookId } = req.params;
  const decodedJwt = ensureAuthorization(req, res);

  if (decodedJwt instanceof TokenExpiredError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "로그인 세션이 만료되었습니다. 다시 로그인 해주세요" });
  }

  const sql =
    "SELECT *, (SELECT count(*) FROM likes WHERE book_id = books.id) AS likes, (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND book_id = books.id)) as liked FROM bookstore.books LEFT OUTER JOIN categories ON books.category_id = categories.category_id WHERE books.id = ?";

  conn.query(sql, [decodedJwt.id, bookId], (err, results) => {
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
