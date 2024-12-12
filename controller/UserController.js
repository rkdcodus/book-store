const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

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
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";

  conn.query(sql, email, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const user = results[0];

    if (user && user.password == password) {
      const token = jwt.sign(
        {
          email: user.email,
        },
        process.env.PRIVATE_KEY,
        {
          expiresIn: "5m",
          issuer: "codus",
        }
      );

      res.cookie("token", token, {
        httpOnly: true,
      });

      return res.status(StatusCodes.OK).json({ message: "로그인 성공" });
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 실패" });
  });
};

const passwordResetRequest = (req, res) => {
  const { email } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";

  conn.query(sql, email, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const user = results[0];

    if (user) {
      return res.status(StatusCodes.OK).end();
    }

    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "가입된 이메일이 아닙니다." });
  });
};

const passwordReset = (req, res) => {
  res.json("비밀번호 초기화");
};

module.exports = { join, login, passwordResetRequest, passwordReset };
