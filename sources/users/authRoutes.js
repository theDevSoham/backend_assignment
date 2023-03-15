const express = require('express');

const router = express.Router();

router.post('/api/authenticate', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    res.status(200).json({ message: 'Success' });
});

module.exports = router;