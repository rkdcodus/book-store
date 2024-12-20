const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

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

const getOrderSheet = (req, res) => {
  res.json("주문서 조회");
};

module.exports = { createOrderSheets, getOrderSheet };
