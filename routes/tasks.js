const express = require("express");
const router = express.Router();
const Tasks = require("../models/taskModel");

// Chèn dữ liệu vào MongoDB
router.post("/add", async (req, res) => {
    try {
        const taskData = {
            ...req.body,
            status: "",
            dateStart: "",
            dateEnd: "",
        };
        const data = await Tasks.create(taskData);
        res.json({ mes: "Thêm thành công!", data: data });
    } catch (err) {
        res.json({ mes: "Thêm thất bại!" });
        throw err;
    }
});
router.get("/board/:boardId", async (req, res) => {
    try {
        const boardId = req.params.boardId;
        const tasks = await Tasks.find({ board: boardId }).populate("list");
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi lấy dữ liệu");
    }
});
router.get("/list/:listId", async (req, res) => {
    try {
        const listId = req.params.listId;
        const tasks = await Tasks.find({ list: listId }).populate("list");
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi lấy dữ liệu");
    }
});

// router.get("/getAll", async (req, res) => {
//     try {
//         const data = await Tasks.find().exec();
//         res.json(data);
//     } catch (err) {
//         throw err;
//     }
// });

// router.get("/:id", async (req, res) => {
//     try {
//         const id = req.params.id;
//         const data = await Tasks.findOne({ _id: id });

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

router.put("/:taskId", async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const updatedTaskData = req.body;

        // Cập nhật task
        const updatedTask = await Tasks.findByIdAndUpdate(taskId, updatedTaskData, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ message: "Không tìm thấy task cần cập nhật" });
        }

        res.json({ message: "Cập nhật thành công", task: updatedTask });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi cập nhật task");
    }
});

router.delete("/:taskId", async (req, res) => {
    const taskId = req.params.taskId;
    try {
        const deletedTask = await Tasks.findByIdAndDelete(taskId);
        if (deletedTask) {
            res.json({ message: "Xóa task thành công" });
        } else {
            res.json({ message: "Không tìm thấy task cần xóa" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi xóa task");
    }
});

module.exports = router;
