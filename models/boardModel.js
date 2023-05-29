const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["personal", "team"],
        required: true,
    },
});

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;
