const Expense = require('../models/Expense');
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
            const expense = new Expense({
                ...req.body,
                user: req.user._id
            });
            await expense.save();
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
            responseHandler.success(res, 200, null, 'Expense deleted successfully');
        } catch (error) {
            responseHandler.error(res, 500, error.message);
        }
    }
};

module.exports = expenseController;