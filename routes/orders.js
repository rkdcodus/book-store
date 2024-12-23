const express = require("express");
const { createOrderSheets, getOrderSheet } = require("../controller/OrderController");
const router = express.Router();

router.use(express.json());

router.post("/", createOrderSheets); // 주문서 등록하기(결제하기)
router.get("/", getOrderSheet); // 주문서 조회

module.exports = router;
