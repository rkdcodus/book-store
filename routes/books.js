const express = require("express");
const router = express.Router();

router.use(express.json());

// 도서 전체 조회
router.get("/", (req, res) => {
  res.json("도서 전체 조회");
});

// 도서 개별 조회
router.get("/:bookId", (req, res) => {
  res.json("도서 개별 조회");
});

module.exports = router;
