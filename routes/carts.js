const express = require("express");
const router = express.Router();

router.use(express.json());

// 주문하기 (도서 선택하기)
router.put("/", (req, res) => {
  res.json("주문하기");
});

// 장바구니에 담은 도서 조회
router.get("/:userId", (req, res) => {
  res.json("장바구니에 담은 도서 조회");
});

// 장바구니 담기
router.post("/:userId", (req, res) => {
  res.json("장바구니 담기");
});

// 장바구니 도서 삭제
router.delete("/:orderId", (req, res) => {
  res.json("장바구니 도서 삭제");
});

module.exports = router;
