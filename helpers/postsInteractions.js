const { LikesModel, CommentModel } = require('../models/PostsModel');

const getNumberofLikes = async(postId) => {
    const count = (await LikesModel.findOne({ post_id: postId })).liked_by.length;
    return count;
};

const getNumberOfComments = async(postId) => {
    const count = (await CommentModel.findOne({ post_id: postId })).comments.length;
    return count;
};

const getAllComments = async(postId) => {
    const comments = (await CommentModel.findOne({ post_id: postId })).comments;
    return comments;
};

const getAllLikes = async(postId) => {
    const likes = (await LikesModel.findOne({ post_id: postId })).liked_by;
    return likes;
};

module.exports = {
    getNumberofLikes,
    getNumberOfComments,
    getAllComments,
    getAllLikes,
};