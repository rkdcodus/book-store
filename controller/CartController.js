const { Result } = require("express-validator");
const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const selectBooks = (req, res) => {
  res.json("장바구니에서 도서 선택하기 ");
};

const getCarts = (req, res) => {
  const { userId } = req.body;
  const sql = ` SELECT orders.id as orderId, book_id as bookId, selected, title, summary, price, quantity 
                FROM orders 
                LEFT JOIN books 
                ON orders.book_id = books.id 
                WHERE user_id = ?`;

  conn.query(sql, userId, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    res.status(StatusCodes.OK).json(results);
  });
};

const addToCart = (req, res) => {
  const { userId, bookId, quantity } = req.body;
  const sql = "INSERT INTO orders ( user_id, book_id, quantity) VALUES (?,?,?)";

  conn.query(sql, [userId, bookId, quantity], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    res.status(StatusCodes.CREATED).json(results);
  });
};

const removeBookFromCart = (req, res) => {
  res.json("장바구니 도서 삭제");
};

module.exports = { selectBooks, getCarts, addToCart, removeBookFromCart };
