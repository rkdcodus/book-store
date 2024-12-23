const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const ensureAuthorization = require("./authorization");
const { TokenExpiredError, JsonWebTokenError } = require("jsonwebtoken");

const addLike = (req, res) => {
  const sql = "INSERT INTO likes (user_id, book_id) VALUES (?, ?)";
  const { bookId } = req.params;
  const decodedJwt = ensureAuthorization(req, res);

  if (decodedJwt instanceof TokenExpiredError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "로그인 세션이 만료되었습니다. 다시 로그인 해주세요" });
  } else if (decodedJwt instanceof JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "잘못된 토큰입니다." });
  }

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

  if (decodedJwt instanceof TokenExpiredError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "로그인 세션이 만료되었습니다. 다시 로그인 해주세요" });
  } else if (decodedJwt instanceof JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "잘못된 토큰입니다." });
  }

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
