const express = require("express");
const { verifyToken } = require("../../middlewares/verifyToken");
const {
    PostModel,
    LikesModel,
    DislikesModel,
    CommentModel,
} = require("../../models/PostsModel");
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

    const newComments = new CommentModel({
        _id: new mongoose.Types.ObjectId(),
        post_id: post_id,
        comments: [],
    });

    Promise.all([newLikes.save(), newDislikes.save(), newComments.save()]).then(
        async(values) => {
            const success = await newPost.save();
            return res.json({
                post_id: success._id,
                title: success.post.title,
                description: success.post.description,
                created_at: success.date_created,
            });
        }
    );
});

router.delete("/api/posts/:id", verifyToken, async(req, res) => {
    const user = res.locals.user;

    const { id } = req.params;

    try {
        const post = await PostModel.find({ _id: id });

        if (post.length === 0) {
            return res.status(400).json({ error: "Post not found" });
        }

        if (post[0].user_id.toString() !== user._id.toString()) {
            return res
                .status(400)
                .json({ error: "You are not the owner of this post" });
        } else {

            Promise.all([
                LikesModel.findOneAndDelete({ post_id: id }),
                DislikesModel.findOneAndDelete({ post_id: id }),
                CommentModel.findOneAndDelete({ post_id: id }),
            ]).then(async(values) => {
                const deletedPost = await PostModel.findOneAndDelete({ _id: id });
                return res
                    .status(200)
                    .json({ message: "Post deleted", post: deletedPost.post });
            });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.post("/api/like/:id", verifyToken, async(req, res) => {
    const user = res.locals.user;

    const { id } = req.params;

    try {
        const post = await PostModel.findOne({ _id: id });

        if (!post) {
            return res.status(400).json({ error: "Post not found" });
        }

        const dislikes = await DislikesModel.findOne({ post_id: id });
        const likes = await LikesModel.findOne({ post_id: id });

        if (likes.liked_by.includes(user._id)) {
            return res.status(400).json({ error: "You already liked this post" });
        }

        if (dislikes.disliked_by.includes(user._id)) {
            const index = dislikes.disliked_by.indexOf(user._id);
            dislikes.disliked_by.splice(index, 1);
            const dislikesOfPost = await DislikesModel.updateOne({ post_id: id }, { disliked_by: dislikes.disliked_by });
        }

        const liked = await LikesModel.updateOne({ post_id: id }, { $push: { liked_by: user._id } });

        res.status(200).json({ message: "Post liked", liked });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.post("/api/unlike/:id", verifyToken, async(req, res) => {
    const user = res.locals.user;

    const { id } = req.params;

    try {
        const post = await PostModel.findOne({ _id: id });

        if (!post) {
            return res.status(400).json({ error: "Post not found" });
        }

        const dislikes = await DislikesModel.findOne({ post_id: id });
        const likes = await LikesModel.findOne({ post_id: id });

        if (dislikes.disliked_by.includes(user._id)) {
            return res.status(400).json({ error: "You already unliked this post" });
        }

        if (likes.liked_by.includes(user._id)) {
            const index = likes.liked_by.indexOf(user._id);
            likes.liked_by.splice(index, 1);
            const likesOfPost = await LikesModel.updateOne({ post_id: id }, { liked_by: likes.liked_by });
        }

        const unliked = await DislikesModel.updateOne({ post_id: id }, { $push: { disliked_by: user._id } });

        res.status(200).json({ message: "Post unliked", unliked });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.post("/api/comment/:id", verifyToken, async(req, res) => {
    const user = res.locals.user;

    const { id } = req.params;

    const commentByUser = req.body.comment;

    if (!commentByUser) {
        return res.status(400).json({ error: "Please fill all fields" });
    }

    try {
        const post = await PostModel.findOne({ _id: id });

        if (!post) {
            return res.status(400).json({ error: "Post not found" });
        }

        const comment_id = new mongoose.Types.ObjectId();

        CommentModel.updateOne({ post_id: id }, {
                $push: {
                    comments: {
                        user_id: user._id,
                        comment: commentByUser,
                        _id: comment_id,
                    },
                },
            })
            .then(async() => {
                return res
                    .status(200)
                    .json({ message: "Comment added", commentId: comment_id });
            })
            .catch((err) => {
                return res.status(500).json({ error: err.message });
            });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;