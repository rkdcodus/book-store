const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config();

const app = express();

app.use(morgan("dev"));

app.listen(process.env.PORT, () => console.log("서버가 돌아갑니다"));
