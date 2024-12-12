const express = require("express");
const { StatusCodes } = require("http-status-codes");
const { body, validationResult } = require("express-validator");
const {
  join,
  login,
  passwordResetRequest,
  passwordReset,
} = require("../controller/UserController");

const router = express.Router();

router.use(express.json());

const validator = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) return next();

  res.status(StatusCodes.BAD_REQUEST).json(err.array());
};

// 회원가입
router.post(
  "/join",
  [
    body("email").notEmpty().isEmail().withMessage("이메일 입력 필요"),
    body("password").notEmpty().withMessage("비밀번호 입력 필요"),
    validator,
  ],
  join
);

router.post("/login", login);
router.post("/reset", passwordResetRequest);
router.put("/reset", passwordReset);

module.exports = router;
