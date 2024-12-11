const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config();

const app = express();

const userRouter = require("./routes/users");
const bookRouter = require("./routes/books");
const likeRouter = require("./routes/likes");
const orderRouter = require("./routes/orders");
const cartRouter = require("./routes/carts");
const reviewRouter = require("./routes/reviews");
const categoryRouter = require("./routes/categories");
const imageRouter = require("./routes/images");

app.use(morgan("dev"));
app.use("/user", userRouter);
app.use("/book", bookRouter);
app.use("/like", likeRouter);
app.use("/order", orderRouter);
app.use("/cart", cartRouter);
app.use("/review", reviewRouter);
app.use("/category", categoryRouter);
app.use("/image", imageRouter);

app.listen(process.env.PORT, () => console.log("서버가 돌아갑니다"));
