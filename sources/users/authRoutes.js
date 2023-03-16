const express = require('express');
const userModel = require('../../models/UsersModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_KEY } = process.env;

const router = express.Router();

const getJWT = (user) => {
    const payload = {
        id: user.email,
    };

    const token = jwt.sign(payload, JWT_KEY, {
        expiresIn: '365d',
    });

    return token;
};

router.post('/api/authenticate', async(req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const user = await userModel.find({ email });
        const serverPass = user[0].password;

        if (user.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        } else {
            //console.log('JWT: ', getJWT(user[0]));
            bcrypt.compare(password, serverPass, (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Internal server error' });
                } else if (result) {
                    return res.status(200).json({ message: 'Authentication successful', accessToken: getJWT(user[0]) });
                } else {
                    return res.status(401).json({ message: 'Authentication failed' });
                }
            });
        }

    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;