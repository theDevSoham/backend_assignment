const followModel = require('../models/FollowModel');

const getFollowers = async(userId) => {
    let count = 0;
    const allFollowing = await followModel.find({});

    if (allFollowing.length === 0) {
        return count;
    }

    allFollowing.map((follow) => {
        follow.following.map((following) => {
            if (following.toString() === userId.toString()) {
                count++;
            }
        });
    });

    return count;
};

const getFollowing = async(userId) => {
    const following = (await followModel.find({ user: userId }))[0];
    if (typeof following === "undefined") {
        return 0;
    }
    return following.following.length;
};

module.exports = { getFollowers, getFollowing };