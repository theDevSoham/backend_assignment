const mongoose = require("mongoose");

const PostsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    post: {
        title: String,
        description: String,
    },
    date_created: String,
});

const LikesSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    post_id: mongoose.Schema.Types.ObjectId,
    liked_by: Array.of(mongoose.Schema.Types.ObjectId),
});

const DislikesSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    post_id: mongoose.Schema.Types.ObjectId,
    disliked_by: Array.of(mongoose.Schema.Types.ObjectId),
});

const PostModel = mongoose.model('posts', PostsSchema);
const LikesModel = mongoose.model('liked_posts', LikesSchema);
const DislikesModel = mongoose.model('disliked_posts', DislikesSchema);

module.exports = {
    PostModel,
    LikesModel,
    DislikesModel,
}