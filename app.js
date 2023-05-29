const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const port = 3000;
const app = express();
const indexRouter = require("./routes/index");
const mongoose = require("mongoose");

// check
// view engine setup
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// router
indexRouter(app);

mongoose
    .connect("mongodb://127.0.0.1:27017/taskhub", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Đã kết nối server mongo!");
    })
    .catch(() => {
        console.log("Kết nối server thất bại!");
    });
app.listen(port, () => {
    console.log(`Project is running at port ${port}`);
});
