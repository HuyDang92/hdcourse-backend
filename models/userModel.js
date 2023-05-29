const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    id: Number,
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

const Users = mongoose.model("user", userSchema);

module.exports = Users;
