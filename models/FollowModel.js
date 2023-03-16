const mongoose = require("mongoose");

const FollowerSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: mongoose.Schema.Types.ObjectId,
    following: Array.of(mongoose.Schema.Types.ObjectId),
});

module.exports = mongoose.model("follows", FollowerSchema);