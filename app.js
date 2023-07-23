const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const indexRouter = require("./routes/index");
const mongoose = require("mongoose");
require("dotenv").config();
const port = process.env.PORT;
console.log(port);
const app = express();

// app.set("views", path.join(__dirname, "./views"));
// app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// router
indexRouter(app);

mongoose
   .connect(
      `mongodb+srv://huy922003:${process.env.PASSWORD_DB}@cluster0.wppsko4.mongodb.net/?retryWrites=true&w=majority`,
      {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      }
   )
   .then(() => {
      console.log("Đã kết nối server!");
   })
   .catch(() => {
      console.log("Kết nối server thất bại!");
   });
app.listen(port, () => {
   console.log(`Project is running at port ${port}`);
});
