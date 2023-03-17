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

router.delete("/api/posts/:id", verifyToken, async(req, res) => {
    const user = res.locals.user;

    const { id } = req.params;

    try {
        const post = await PostModel.find({ _id: id });

        if (post.length === 0) {
            return res.status(400).json({ error: "Post not found" });
        };

        if (post[0].user_id.toString() !== user._id.toString()) {
            return res.status(400).json({ error: "You are not the owner of this post" });
        } else {

            const deletedPost = await PostModel.findOneAndDelete({ _id: id })

            return res.status(200).json({ message: "Post deleted", post: deletedPost });
        }
    } catch (error) {

    }

    console.log(id);
    res.send("ok");
});

module.exports = router;