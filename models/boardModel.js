const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
    user: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    ],
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["personal", "team"],
        // required: true,
    },
});

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;
