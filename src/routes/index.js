const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const expenseRoutes = require('./expenseRoutes');
const categoryRoutes = require('./categoryRoutes');

router.use('/auth', authRoutes);
router.use('/expenses', expenseRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;