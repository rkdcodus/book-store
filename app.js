const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.listen(process.env.PORT, () => console.log("서버가 돌아갑니다"));
