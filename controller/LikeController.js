const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const addLike = (req, res) => {
  const sql = "INSERT INTO likes (user_id, book_id) VALUES (?, ?)";
  const { userId } = req.body;
  const { bookId } = req.params;

  conn.query(sql, [userId, bookId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.CREATED).end();
  });
};

const removeLike = (req, res) => {
  const sql = "DELETE FROM likes WHERE user_id = ? AND book_id = ?";
  const { userId } = req.body;
  const { bookId } = req.params;

  conn.query(sql, [userId, bookId], (err, results) => {
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
