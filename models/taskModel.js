const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        required: true,
    },
    list: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "List",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    status: {
        type: String,
    },
    dateStart: {
        type: String,
    },
    dateEnd: {
        type: String,
    },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
