const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const ensureAuthorization = require("./authorization");
const { TokenExpiredError, JsonWebTokenError } = require("jsonwebtoken");

const getBooks = async (req, res) => {
  const { category, news, limit, currentPage } = req.query;
  let sqlQuery = [];
  let sql =
    "SELECT *, (SELECT count(*) FROM likes WHERE book_id = books.id) AS likes FROM bookstore.books LEFT OUTER JOIN categories ON books.category_id = categories.category_id ";

  if (category) sqlQuery.push(`books.category_id = ${category} `);
  if (news) sqlQuery.push("pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW() ");

  if (sqlQuery.length) sql += "where " + sqlQuery.join("and ");

  if (limit && currentPage) sql += `LIMIT ${+limit} OFFSET ${limit * (currentPage - 1)}`;

  try {
    const [BooksResults] = await conn.promise().query(sql);
    const [PaginationResults] = await conn
      .promise()
      .query("SELECT count(*) as totalCount FROM books");

    res.status(StatusCodes.OK).json({ books: BooksResults, pagination: PaginationResults[0] });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

const getBook = (req, res) => {
  const { bookId } = req.params;
  const decodedJwt = ensureAuthorization(req, res);
  let sql = "";
  let values = [];

  if (decodedJwt instanceof TokenExpiredError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "로그인 세션이 만료되었습니다. 다시 로그인 해주세요" });
  } else if (decodedJwt instanceof JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "잘못된 토큰입니다." });
  } else if (decodedJwt instanceof ReferenceError) {
    sql =
      "SELECT *, (SELECT count(*) FROM likes WHERE book_id = books.id) AS likes FROM bookstore.books LEFT OUTER JOIN categories ON books.category_id = categories.category_id WHERE books.id = ?";

    values = [bookId];
  } else {
    sql =
      "SELECT *, (SELECT count(*) FROM likes WHERE book_id = books.id) AS likes, (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND book_id = books.id)) as liked FROM bookstore.books LEFT OUTER JOIN categories ON books.category_id = categories.category_id WHERE books.id = ?";
    values = [decodedJwt.id, bookId];
  }

  conn.query(sql, values, (err, results) => {
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
