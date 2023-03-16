const jwt = require('jsonwebtoken');
const { JWT_KEY } = process.env;
const userSchema = require('../models/UsersModel');

const verifyToken = (req, res, next) => {

    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthenticated' });
    }

    const accessToken = token.replace('Bearer ', '');

    jwt.verify(accessToken, JWT_KEY, async(err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token expired or invalid' });
        }
        //res.locals.user = decoded.id;
        const user = await userSchema.find({ email: decoded.id });
        if (user.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        } else {
            res.locals.user = user[0];
            next();
        }
    });
}

module.exports = { verifyToken };