const express = require('express');
const { getFollowing, getFollowers } = require('../../helpers/followerInteractions');
const { verifyToken } = require('../../middlewares/verifyToken');

const router = express.Router();

router.get('/api/user', verifyToken, async(req, res) => {

    const user = res.locals.user;

    const followers = await getFollowers(user._id);
    const following = await getFollowing(user._id);

    res.json({ username: user.name, followers: followers, following: following });
});

module.exports = router;