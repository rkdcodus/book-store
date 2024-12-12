const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const join = (req, res) => {
  const { email, password } = req.body;
  const sql = "INSERT INTO users (email, password) VALUES (?,?);";

  conn.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    res.status(StatusCodes.CREATED).json(results);
  });
};

const login = (req, res) => {
  res.json("로그인");
};

const passwordResetRequest = (req, res) => {
  res.json("비밀번호 초기화 요청");
};

const passwordReset = (req, res) => {
  res.json("비밀번호 초기화");
};

module.exports = { join, login, passwordResetRequest, passwordReset };
