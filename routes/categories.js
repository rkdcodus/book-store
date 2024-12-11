const express = require("express");
const router = express.Router();

router.use(express.json());

// 카테고리 조회하기
router.get("/", (req, res) => {
  res.json(" 카테고리 조회하기");
});

module.exports = router;
