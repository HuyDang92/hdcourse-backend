const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
});

const List = mongoose.model("List", boardSchema);

module.exports = List;
