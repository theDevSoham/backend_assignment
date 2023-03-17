const { PostModel, LikesModel, DislikesModel, CommentModel } = require('../models/PostsModel');

const getNumberofLikes = async(postId) => {
    const count = (await LikesModel.findOne({ post_id: postId })).liked_by.length;
    return count;
};

const getNumberOfComments = async(postId) => {
    const count = (await CommentModel.findOne({ post_id: postId })).comments.length;
    return count;
};

module.exports = {
    getNumberofLikes,
    getNumberOfComments
};