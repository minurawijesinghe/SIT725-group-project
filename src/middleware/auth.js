const jwt = require('jsonwebtoken');
const User = require('../models/User');
const responseHandler = require('../utils/responseHandler');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log('Token:', token);

        
        if (!token) {
            return responseHandler.error(res, 401, 'No token provided');
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user
        console.log('DecodedId:', decoded.id);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return responseHandler.error(res, 401, 'User not found');
        }

        // Add user and token to request
        req.user = user;
        req.token = token;
        
        next();
    } catch (error) {
        responseHandler.error(res, 401, 'Please authenticate');
    }
};

module.exports = auth;