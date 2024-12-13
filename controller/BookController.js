const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const getBooks = (req, res) => {
  res.json("도서 전체 조회");
};

const getBook = (req, res) => {
  res.json("도서 개별 조회");
};

module.exports = { getBooks, getBook };
