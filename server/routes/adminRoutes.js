const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Admin stats route
router.get('/stats', async (req, res) => {
    try {
        let stats = {
            totalSales: 0,
            activeOrders: 0,
            totalUsers: 0
        };

        try {
            const users = await User.find();
            stats.totalUsers = users.length;
        } catch (err) {
            console.error('Error fetching users:', err);
        }

        try {
            const orders = await Order.find();
            if (orders.length > 0) {
                stats.totalSales = orders.reduce((acc, order) => acc + (order.total || 0), 0);
                stats.activeOrders = orders.filter(order => order.status === 'pending').length;
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
        }

        res.json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('Error in stats route:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router; 