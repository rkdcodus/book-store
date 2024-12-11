const express = require("express");
const router = express.Router();

router.use(express.json());

// 도서별 좋아요 수 전체 조회
router.get("/:bookId", (req, res) => {
  res.json("도서별 좋아요 수 전체 조회");
});

// 좋아요 누르기
router.post("/:bookId", (req, res) => {
  res.json("좋아요 누르기");
});

// 좋아요 취소하기
router.delete("/:bookId", (req, res) => {
  res.json("좋아요 취소하기");
});

module.exports = router;
