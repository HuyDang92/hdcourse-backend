const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
   {
      fullname: String,
      email: {
         type: String,
         required: true,
      },
      password: {
         type: String,
         required: true,
      },
      phone: {
         type: String,
         required: false,
      },
      avatar: {
         type: String,
         required: false,
      },
      role: {
         type: String,
         required: true,
      },
   },
   { timestamps: true }
);

const Users = mongoose.model("User", userSchema);

module.exports = Users;
