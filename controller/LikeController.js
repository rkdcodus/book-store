const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const getLikes = (req, res) => {};

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
  res.json("좋아요 취소하기");
};

module.exports = { getLikes, addLike, removeLike };
