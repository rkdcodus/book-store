const express = require("express");
const router = express.Router();

router.use(express.json());

// 주문서 등록하기(결제하기)
router.post("/", (req, res) => {
  res.json("주문서 등록하기(결제하기)");
});

// 주문서 조회
router.get("/:userId", (req, res) => {
  res.json("주문서 조회");
});

module.exports = router;
