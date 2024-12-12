const express = require("express");
const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const { body, validationResult } = require("express-validator");

const router = express.Router();

router.use(express.json());

function validator(req, res, next) {
  const err = validationResult(req);

  if (err.isEmpty()) return next();

  res.status(StatusCodes.BAD_REQUEST).json(err.array());
}

// 회원가입
router.post(
  "/join",
  [
    body("email").notEmpty().isEmail().withMessage("이메일 입력 필요"),
    body("password").notEmpty().withMessage("비밀번호 입력 필요"),
    validator,
  ],
  (req, res) => {
    const { email, password } = req.body;
    const sql = "INSERT INTO users (email, password) VALUES (?,?);";

    conn.query(sql, [email, password], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
      res.status(StatusCodes.CREATED).json(results);
    });
  }
);

// 로그인
router.post("/login", (req, res) => {
  res.json("로그인");
});

// 비밀번호 초기화 요청
router.post("/", (req, res) => {
  res.json("비밀번호 초기화 요청");
});

// 비밀번호 초기화
router.put("/", (req, res) => {
  res.json("비밀번호 초기화");
});

module.exports = router;
