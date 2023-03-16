const express = require('express');

const router = express.Router();

router.post('/api/follow/:id', async(req, res) => {

    const { accessToken } = req.body;

    if (!accessToken) {
        return res.status(401).json({ message: 'Unauthenticated' });
    }

    return res.send("ID: " + req.params.id);
});

module.exports = router;