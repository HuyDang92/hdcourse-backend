const express = require("express");
const router = express.Router();
const Boards = require("../models/boardModel");
const Lists = require("../models/listModel");
const Tasks = require("../models/taskModel");

// Chèn dữ liệu vào MongoDB
router.post("/add", async (req, res) => {
    try {
        const userData = {
            ...req.body,
        };
        const newBoard = await Boards.create(userData);

        // Create default lists for the new board
        const defaultLists = [
            { title: "Cần làm", board: newBoard._id },
            { title: "Đang làm", board: newBoard._id },
            { title: "Đã xong", board: newBoard._id },
        ];
        await Lists.insertMany(defaultLists);

        res.json({ mes: "Thêm thành công!", boardId: newBoard._id });
    } catch (err) {
        res.json({ mes: "Thêm thất bại!" });
        throw err;
    }
});

router.get("/getAll", async (req, res) => {
    try {
        const data = await Boards.find().exec();
        res.json(data);
    } catch (err) {
        throw err;
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Boards.findOne({ _id: id });

        if (data) {
            res.json(data);
        } else {
            res.json({ message: "Không tìm thấy bảng" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi lấy dữ liệu");
    }
});

router.put("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Boards.findByIdAndUpdate(id, req.body, { new: true });
        if (data) {
            res.json({ mes: "Cập nhật thành công" });
        } else {
            res.json({ mes: "Cập nhật thất bại" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi cập nhật dữ liệu");
    }
});

// router.delete("/:id", async (req, res) => {
//     try {
//         const id = req.params.id;
//         // Tìm và xóa record trong MongoDB
//         await Boards.deleteOne({ _id: id });
//         res.json({ mes: "Xóa thành công" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Lỗi xóa record");
//     }
// });
router.delete("/:boardId", async (req, res) => {
    try {
        const boardId = req.params.boardId;

        // Xóa tất cả các task có boardId tương ứng
        await Tasks.deleteMany({ board: boardId });
        await Lists.deleteMany({ board: boardId });
        await Boards.findByIdAndDelete(boardId);

        res.json({ message: "Xóa thành công " });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi xóa!");
    }
});

module.exports = router;
