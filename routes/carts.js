const express = require("express");
const {
  selectBooks,
  getCarts,
  addToCart,
  removeBookFromCart,
} = require("../controller/CartController");
const router = express.Router();

router.use(express.json());

router.get("/selected", selectBooks);
router.get("/", getCarts);
router.post("/", addToCart);
router.delete("/:orderId", removeBookFromCart);

module.exports = router;
