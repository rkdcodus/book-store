const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const ensureAuthorization = require("./authorization");

const addLike = (req, res) => {
  const sql = "INSERT INTO likes (user_id, book_id) VALUES (?, ?)";
  const { bookId } = req.params;
  const decodedJwt = ensureAuthorization(req, res);

  conn.query(sql, [decodedJwt.id, bookId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.CREATED).end();
  });
};

const removeLike = (req, res) => {
  const sql = "DELETE FROM likes WHERE user_id = ? AND book_id = ?";
  const { bookId } = req.params;
  const decodedJwt = ensureAuthorization(req, res);

  conn.query(sql, [decodedJwt.id, bookId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (!results.affectedRows) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).end();
  });
};

module.exports = { addLike, removeLike };
