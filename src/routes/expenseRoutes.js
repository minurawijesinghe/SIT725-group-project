const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const expenseLimitController = require('../controllers/expenseLimitController'); // Import the expense limit controller
const auth = require('../middleware/auth');

// Apply auth middleware to all expense routes
router.use(auth);

// Expense routes
router.get('/', expenseController.getExpenses); // Get all expenses
router.post('/', expenseController.createExpense); // Create a new expense
router.put('/:id', expenseController.updateExpense); // Update an expense
router.delete('/:id', expenseController.deleteExpense); // Delete an expense

// Expense limit routes
router.post('/limit', expenseLimitController.setExpenseLimit); // Set or update expense limit

module.exports = router;
