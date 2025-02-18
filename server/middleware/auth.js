const jwt = require('jsonwebtoken');
const db = require('../config/database');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No authentication token, access denied'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user role from MySQL database
        const [user] = await db.query(
            'SELECT role FROM users WHERE id = ?',
            [decoded.id]
        );

        if (!user || user.length === 0) {
            throw new Error('User not found');
        }

        req.user = {
            ...decoded,
            role: user[0].role
        };
        
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token is invalid or expired'
        });
    }
};

module.exports = auth; 