const Expense = require('../models/Expense');
const ExpenseLimit = require('../models/ExpenseLimit'); // Import the expense limit model
const responseHandler = require('../utils/responseHandler');

const expenseController = {
    getExpenses: async (req, res) => {
        try {
            const expenses = await Expense.find({ user: req.user._id })
                .populate('category')
                .sort('-date');
            responseHandler.success(res, 200, expenses);
        } catch (error) {
            responseHandler.error(res, 500, error.message);
        }
    },

    createExpense: async (req, res) => {
        try {
            // Create a new expense
            const expense = new Expense({
                ...req.body,
                user: req.user._id
            });
            await expense.save();

            // Update the total expenses for the user
            const expenseLimit = await ExpenseLimit.findOne({ user: req.user._id });

            if (expenseLimit) {
                expenseLimit.totalExpenses += expense.amount;

                // Check if the user is within the final 10% of their limit
                const remainingAmount = expenseLimit.limit - expenseLimit.totalExpenses;
                if (remainingAmount <= expenseLimit.limit * 0.1) {
                    // Emit a notification via Socket.IO
                    const io = req.app.get('socketio');
                    io.emit(`user:${req.user._id}:limitWarning`, {
                        message: 'You are within the final 10% of your expense limit!',
                        remainingAmount,
                    });
                }

                await expenseLimit.save();
            }

            responseHandler.success(res, 201, expense, 'Expense created successfully');
        } catch (error) {
            responseHandler.error(res, 400, error.message);
        }
    },

    updateExpense: async (req, res) => {
        try {
            const expense = await Expense.findOneAndUpdate(
                { _id: req.params.id, user: req.user._id },
                req.body,
                { new: true }
            );
            if (!expense) {
                return responseHandler.error(res, 404, 'Expense not found');
            }
            responseHandler.success(res, 200, expense, 'Expense updated successfully');
        } catch (error) {
            responseHandler.error(res, 400, error.message);
        }
    },

    deleteExpense: async (req, res) => {
        try {
            const expense = await Expense.findOneAndDelete({
                _id: req.params.id,
                user: req.user._id
            });
            if (!expense) {
                return responseHandler.error(res, 404, 'Expense not found');
            }

            // If the expense is deleted, adjust the totalExpenses for the user
            const expenseLimit = await ExpenseLimit.findOne({ user: req.user._id });
            if (expenseLimit) {
                expenseLimit.totalExpenses -= expense.amount;
                if (expenseLimit.totalExpenses < 0) expenseLimit.totalExpenses = 0;
                await expenseLimit.save();
            }

            responseHandler.success(res, 200, null, 'Expense deleted successfully');
        } catch (error) {
            responseHandler.error(res, 500, error.message);
        }
    }
};

module.exports = expenseController;
