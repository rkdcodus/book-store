const express = require("express");
const { addLike, removeLike, getLikes } = require("../controller/LikeController");
const router = express.Router();

router.use(express.json());

router.post("/:bookId", addLike);
router.delete("/:bookId", removeLike);

module.exports = router;
