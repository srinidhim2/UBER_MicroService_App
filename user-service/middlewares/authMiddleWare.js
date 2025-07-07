const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const blacklisttokenModel = require('../models/blacklisttoken.model');


module.exports.userAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token =  (authHeader && authHeader.split(' ')[1]) || req.cookies.token
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const isBlacklisted = await blacklisttokenModel.find({ token });

        if (isBlacklisted.length) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;

        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}