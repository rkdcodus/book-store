const express = require("express");
const { category } = require("../controller/CategoryController");
const router = express.Router();

router.use(express.json());

router.get("/", category);

module.exports = router;
