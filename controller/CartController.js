const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const selectBooks = (req, res) => {
  res.json("장바구니에서 도서 선택하기 ");
};

const getCarts = (req, res) => {
  res.json("장바구니에 담은 도서 조회");
};

const addToCart = (req, res) => {
  res.json("장바구니 담기");
};

const removeBookFromCart = (req, res) => {
  res.json("장바구니 도서 삭제");
};

module.exports = { selectBooks, getCarts, addToCart, removeBookFromCart };
