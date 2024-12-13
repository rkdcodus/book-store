const express = require("express");
const { getBooks, getBook } = require("../controller/BookController");
const router = express.Router();

router.use(express.json());

router.get("/", getBooks);

router.get("/:bookId", getBook);

module.exports = router;
