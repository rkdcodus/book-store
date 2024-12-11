const express = require("express");
const router = express.Router();

router.use(express.json());

// 도서별 이미지 조회
router.get("/:bookId", (req, res) => {
  res.json("도서별 이미지 조회");
});

module.exports = router;
