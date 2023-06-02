const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullname: String,
    email: {
        type: String,
        required: true,
    },
    password: String,
    phone: String,
    avatar: String,
    role: Number,
});

const Users = mongoose.model("User", userSchema);

module.exports = Users;
