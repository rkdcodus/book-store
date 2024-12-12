const express = require("express");
const conn = require("../mariadb");
const { body, validationResult } = require("express-validator");

const router = express.Router();

router.use(express.json());

function validator(req, res, next) {
  const err = validationResult(req);

  if (err.isEmpty()) return next();

  res.status(400).json(err.array());
}

// 회원가입
router.post(
  "/join",
  [
    body("email").notEmpty().isEmail().withMessage("이메일 입력 필요"),
    body("name").notEmpty().isString().withMessage("이름 입력 필요"),
    body("password").notEmpty().withMessage("비밀번호 입력 필요"),
    validator,
  ],
  (req, res) => {
    const { email, name, password } = req.body;
    const sql = "INSERT INTO users (email, name, password) VALUES (?,?,?);";

    conn.query(sql, [email, name, password], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(400).end();
      }
    });
    res.status(201).json({ message: `${name}님 회원가입을 축하합니다.` });
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
