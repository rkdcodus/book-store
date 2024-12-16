const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const getLikes = (req, res) => {
  res.json("도서별 좋아요 수 전체 조회");
};

const addLike = (req, res) => {
  res.json("좋아요 누르기");
};

const removeLike = (req, res) => {
  res.json("좋아요 취소하기");
};

module.exports = { getLikes, addLike, removeLike };
