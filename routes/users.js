const express = require("express");
const router = express.Router();
const multer = require("multer");
const Users = require("../models/userModel");

const uploadAvt = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./assets/img/faces"); // Thay đổi đường dẫn lưu trữ thành "/public/img/avt"
    },
    filename: (req, file, cb) => {
        const fileName = `${file.originalname}`;
        cb(null, fileName);
    },
});

// upload avt
router.post("/uploadAvt", multer({ storage: uploadAvt }).single("avt"), (req, res) => {
    // File ảnh đã được lưu vào thư mục /public/img/avt
    res.json({ mes: "Upload thành công vào thư mục" });
    res.status(200).end();
});
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
        res.json({ mes: "Đăng ký thành công", data: data });
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

router.get("/idUser/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Users.findOne({ _id: id });
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi lấy dữ liệu");
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
