const express = require("express");
const userModel = require("../../models/UsersModel");
const followModel = require("../../models/FollowModel");
const { verifyToken } = require("../../middlewares/verifyToken");

const router = express.Router();

router.post("/api/follow/:id", verifyToken, async(req, res) => {
    const user = res.locals.user;
    const { id } = req.params;
    const index = id - 1;

    let toFollow = null;

    //find the user to follow
    const allUsers = await userModel.find({});
    if (allUsers[index].email === user.email) {
        return res.status(400).json({ message: "You cannot follow yourself" });
    }
    toFollow = allUsers[index]._id;

    //check if the user is already following the user
    const follow = await followModel.find({ user: user._id });

    //if the user is not following anyone, create a new follow document and follow the requested user
    if (follow.length === 0) {
        const f = await followModel.insertMany({
            user: user._id,
            following: [toFollow],
        });
        return res
            .status(200)
            .json({ message: "Follow successful", follow: f[0].following });
    } else {
        //if the user is already following the requested user, return an error
        if (follow[0].following.includes(toFollow)) {
            return res.status(400).json({ message: "Already following" });
        } else {
            follow[0].following.push(toFollow);
            const f = await followModel.updateOne({ user: user._id }, { following: follow[0].following });
            return res
                .status(200)
                .json({ message: "Follow successful", follow: f.following });
        }
    }
});

router.post("/api/unfollow/:id", verifyToken, async(req, res) => {
    const user = res.locals.user;
    const { id } = req.params;
    const index = id - 1;

    let toUnfollow = null;

    //find the user to unfollow
    const allUsers = await userModel.find({});
    if (allUsers[index].email === user.email) {
        return res.status(400).json({ message: "You cannot unfollow yourself" });
    }
    toUnfollow = allUsers[index]._id;

    //check if the user is already unfollowing the user
    const follow = await followModel.find({ user: user._id });

    //if the user is not following anyone or is not following the requested user, return an error
    if (follow.length === 0 || !follow[0].following.includes(toUnfollow)) {
        return res.status(400).json({ message: "Not following" });
    } else {
        const index = follow[0].following.indexOf(toUnfollow);
        follow[0].following.splice(index, 1);
        const f = await followModel.updateOne({ user: user._id }, { following: follow[0].following });
        return res
            .status(200)
            .json({ message: "Unfollow successful", unfollow: f.following });
    }
});

module.exports = router;