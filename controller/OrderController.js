const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const ensureAuthorization = require("./authorization");

const createOrderSheets = async (req, res) => {
  const { orderSheet, orderIds } = req.body;
  const orderSheetsSql =
    "INSERT INTO order_sheets (address, receiver, contact, total_price) VALUES (?,?,?,?)";
  const purchasesSql = "INSERT INTO purchases (order_id, order_sheets_id) VALUES ?";
  const ordersSql = "UPDATE orders SET selected = 1 WHERE id IN (?) ";

  try {
    // order_sheets 테이블 insert
    const [results] = await conn.promise().query(orderSheetsSql, [...Object.values(orderSheet)]);
    const values = orderIds.map((orderId) => [orderId, results.insertId]);

    await conn.promise().query(purchasesSql, [values]); // purchases 테이블 insert
    await conn.promise().query(ordersSql, [orderIds]); // orders 테이블 selected 업데이트

    res.status(StatusCodes.CREATED).json(`${results.insertId} 번 주문서가 등록되었습니다.`);
  } catch (err) {
    console.error("error", err);
    res.status(StatusCodes.BAD_REQUEST).json(err);
  }
};

const getOrderSheet = async (req, res) => {
  const decodedJwt = ensureAuthorization(req, res);
  const purchaseSql =
    "SELECT order_sheets_id FROM purchases WHERE order_id IN (SELECT id FROM orders WHERE user_id = ? AND selected = 1)";
  const orderSheetsSql = "SELECT * FROM order_sheets WHERE id = ?";
  const booksSql =
    "SELECT books.id as bookId, title, summary, price, quantity FROM books LEFT JOIN orders ON books.id = orders.book_id WHERE books.id IN (SELECT book_id FROM orders WHERE user_id = ? AND selected = 1)";

  try {
    const [purchaseResult] = await conn.promise().query(purchaseSql, decodedJwt.id);
    const orderSheetId = purchaseResult[0].order_sheets_id;
    const [orderSheetResult] = await conn.promise().query(orderSheetsSql, orderSheetId);
    const [booksResult] = await conn.promise().query(booksSql, decodedJwt.id);

    res.status(StatusCodes.OK).json({ ...orderSheetResult[0], orders: booksResult });
  } catch (err) {
    console.error("error", err);
    res.status(StatusCodes.BAD_REQUEST).json(err);
  }
};

module.exports = { createOrderSheets, getOrderSheet };
