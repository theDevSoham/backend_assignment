const express = require("express");
const { verifyToken } = require("../../middlewares/verifyToken");
const { PostModel, LikesModel, DislikesModel } = require("../../models/PostsModel");
const mongoose = require("mongoose");

const router = express.Router();

router.post("/api/posts", verifyToken, async(req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: "Please fill all fields" });
    }

    const user = res.locals.user;

    const post_id = new mongoose.Types.ObjectId();

    const newPost = new PostModel({
        _id: post_id,
        user_id: user._id,
        post: {
            title: title,
            description: description,
        },
        date_created: new Date().toISOString(),
    });

    const newLikes = new LikesModel({
        _id: new mongoose.Types.ObjectId(),
        user_id: user._id,
        post_id: post_id,
        liked_by: [],
    });

    const newDislikes = new DislikesModel({
        _id: new mongoose.Types.ObjectId(),
        user_id: user._id,
        post_id: post_id,
        disliked_by: [],
    });

    Promise.all([newLikes.save(), newDislikes.save()]).then(async(values) => {
        const success = await newPost.save();
        return res.json({
            post_id: success._id,
            title: success.post.title,
            description: success.post.description,
            created_at: success.date_created,
        });
    });
});

module.exports = router;