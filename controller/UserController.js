const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config();

const makeSalt = () => {
  return crypto.randomBytes(10).toString("base64");
};

const makeHash = (password, salt) => {
  return crypto.pbkdf2Sync(password.toString(), salt, 10000, 10, "sha512").toString("base64");
};

const join = (req, res) => {
  const { email, password } = req.body;

  const salt = makeSalt();
  const hashPassword = makeHash(password, salt);

  const sql = "INSERT INTO users (email, password, salt) VALUES (?,?,?);";
  const values = [email, hashPassword, salt];

  conn.query(sql, values, (err, results) => {
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
    const hashPassword = makeHash(password, user.salt);

    if (user && user.password == hashPassword) {
      const token = jwt.sign(
        {
          id: user.id,
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
      return res.status(StatusCodes.OK).json({ email, message: "비밀번호 초기화 가능합니다." });
    }

    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "가입된 이메일이 아닙니다." });
  });
};

const passwordReset = (req, res) => {
  // 본인 인증 과정 필요
  const { email, password } = req.body;

  const salt = makeSalt();
  const hashPassword = makeHash(password, salt);

  const sql = "UPDATE users SET password = ?, salt = ? WHERE email = ?";
  const values = [hashPassword, salt, email];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results.affectedRows == 0) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    res.status(StatusCodes.OK).json({ message: "비밀번호가 변경되었습니다." });
  });
};

module.exports = { join, login, passwordResetRequest, passwordReset };
