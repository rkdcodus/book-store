const express = require("express");
const {
  selectBooks,
  getCarts,
  addToCart,
  removeBookFromCart,
} = require("../controller/CartController");
const router = express.Router();

router.use(express.json());

router.patch("/", selectBooks);
router.get("/:userId", getCarts);
router.post("/:userId", addToCart);
router.delete("/:orderId", removeBookFromCart);

module.exports = router;
