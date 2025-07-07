const jwt = require('jsonwebtoken');
const axios = require('axios');


module.exports.userAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token =  (authHeader && authHeader.split(' ')[1]) || req.cookies.token
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const response = await axios.get(`${process.env.BASE_URL}/user/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const user = response.data;

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;
        // console.log('Done with user Auth')
        next();

    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.captainAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token =  (authHeader && authHeader.split(' ')[1]) || req.cookies.token
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const response = await axios.get(`${process.env.BASE_URL}/captain/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const captain = response.data;

        if (!captain) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.captain = captain;
        console.log('Done with user Auth')
        next();

    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}