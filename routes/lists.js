const express = require("express");
const router = express.Router();
const Lists = require("../models/listModel");
const Tasks = require("../models/taskModel");

// Chèn dữ liệu vào MongoDB
router.post("/add", async (req, res) => {
    try {
        const taskData = {
            ...req.body,
        };
        const data = await Lists.create(taskData);
        res.json({ mes: "Thêm thành công!" });
    } catch (err) {
        res.json({ mes: "Thêm thất bại!" });
        throw err;
    }
});
router.get("/:boardId", async (req, res) => {
    try {
        const boardId = req.params.boardId;
        const tasks = await Lists.find({ board: boardId }).populate("board");
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi lấy dữ liệu");
    }
});

// router.get("/getAll", async (req, res) => {
//     try {
//         const data = await Lists.find().exec();
//         res.json(data);
//     } catch (err) {
//         throw err;
//     }
// });

// router.get("/:id", async (req, res) => {
//     try {
//         const id = req.params.id;
//         const data = await Lists.findOne({ _id: id });

//         if (data) {
//             res.json(data);
//         } else {
//             res.json({ message: "Không tìm thấy bảng" });
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Lỗi lấy dữ liệu");
//     }
// });

router.put("/:listId", async (req, res) => {
    try {
        const listId = req.params.listId;
        const updatedTaskData = req.body;

        // Cập nhật task
        const updatedList = await Lists.findByIdAndUpdate(listId, updatedTaskData, { new: true });

        if (!updatedList) {
            return res.status(404).json({ message: "Không tìm thấy danh sách cần cập nhật" });
        }

        res.json({ message: "Cập nhật thành công", list: updatedList });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi cập nhật danh sách");
    }
});

// router.delete("/:listId", async (req, res) => {
//     const listId = req.params.listId;
//     try {
//         const deletedList = await Lists.findByIdAndDelete(listId);
//         if (deletedList) {
//             res.json({ message: "Xóa danh sách thành công" });
//         } else {
//             res.json({ message: "Không tìm thấy danh sách cần xóa" });
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Lỗi xóa danh sách");
//     }
// });
router.delete("/:listId", async (req, res) => {
    try {
        const listId = req.params.listId;

        // Xóa tất cả các task có listId tương ứng
        await Tasks.deleteMany({ list: listId });
        await Lists.findByIdAndDelete(listId);

        res.json({ message: "Xóa thành công tất cả các task trong list" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi xóa task");
    }
});

module.exports = router;
