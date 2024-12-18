const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const createOrderSheets = (req, res) => {
  const { orderSheet, orderIds } = req.body;

  // order_sheets 테이블 insert
  conn.query(
    "INSERT INTO order_sheets (address, receiver, contact, total_price) VALUES (?,?,?,?)",
    [...Object.values(orderSheet)],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      // purchases 테이블 insert
      orderIds.map((orderId) => {
        conn.query(
          "INSERT INTO purchases (order_id, order_sheets_id) VALUES (?,?)",
          [orderId, results.insertId],
          (err, results) => {
            if (err) {
              console.error(err);
              return res.status(StatusCodes.BAD_REQUEST).end();
            }
            res.status(StatusCodes.CREATED).json(`${results.insertId} 번 주문서가 등록되었습니다.`);
          }
        );
      });
    }
  );

  // orders 테이블 selected 업데이트
  conn.query("UPDATE orders SET selected = 1 WHERE id IN (?) ", [orderIds], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
  });
};

const getOrderSheet = (req, res) => {
  res.json("주문서 조회");
};

module.exports = { createOrderSheets, getOrderSheet };
