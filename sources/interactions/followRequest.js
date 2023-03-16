const express = require('express');
const userModel = require('../../models/UsersModel');
const followModel = require('../../models/FollowModel');

const router = express.Router();

router.post('/api/follow/:id', async(req, res) => {

    const { accessToken } = req.body;

    if (!accessToken) {
        return res.status(401).json({ message: 'Unauthenticated' });
    }

    try {
        console.log(await followModel.find());
    } catch (err) {
        console.log(err);
    }

    return res.send("ID: " + req.params.id);
});

module.exports = router;