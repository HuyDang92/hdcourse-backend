const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Kết nối MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/taskhub", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

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
// Chèn dữ liệu vào MongoDB
router.post("/add", async (req, res) => {
    try {
        const userData = {
            ...req.body,
            phone: "",
            avatar: "avt.png",
            role: 0,
        };
        const data = await Users.create(userData);
        res.json({ mes: "Đăng ký thành công" });
    } catch (err) {
        throw err;
    }
});

router.get("/getAll", async (req, res) => {
    try {
        const data = await Users.find().exec();
        res.json(data);
    } catch (err) {
        throw err;
    }
});

router.get("/:email", async (req, res) => {
    try {
        const email = req.params.email;
        const data = await Users.findOne({ email: email });
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi lấy dữ liệu");
    }
});

router.put("/:email", async (req, res) => {
    const email = req.params.email;
    // const email = parseInt(req.params.email);
    try {
        const data = await Users.findOne({ email: email });
        if (data) {
            Object.assign(data, req.body);
            console.log(req.body);
            await data.save();
            res.json({ mes: "Cập nhật thành công" });
        } else {
            res.json({ mes: "Cập nhật thất bại" });
        }
    } catch (err) {
        throw err;
    }
});

router.delete("/:email", async (req, res) => {
    try {
        const email = req.params.email;
        // Tìm và xóa record trong MongoDB
        await Users.deleteOne({ email: email });
        res.json({ mes: "Xóa thành công" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi xóa record");
    }
});
module.exports = router;
