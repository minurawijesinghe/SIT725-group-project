const ExpenseLimit = require('../models/expenseLimit');
const responseHandler = require('../utils/responseHandler'); // Assuming you have a utility for responses


const setExpenseLimit = async (req, res, next) => {
  try {
    const { user, limit } = req.body;

    // Validate input
    if (!user || !limit || typeof limit !== 'number' || limit <= 0) {
      return res.status(400).json({ success: false, message: "Invalid input: user and limit are required, and limit must be a positive number." });
    }

    // Upsert (update or create) the expense limit
    const expenseLimit = await ExpenseLimit.findOneAndUpdate(
      { user }, // Search condition
      { user, limit }, // Update data
      { new: true, upsert: true } // Options: return the new document, create if not exists
    );

    res.status(200).json({
      success: true,
      message: expenseLimit._id ? "Expense limit updated successfully" : "Expense limit created successfully",
      data: expenseLimit,
    });
  } catch (error) {
    // Pass errors to global error handler
    next(error);
  }
};

const getRemainingAmount = async (req, res, next) => {
  try {
    const userId = req.user._id; // Assuming authentication middleware provides `req.user`
    console.log('Current User ID:', userId);

    // Find the expense limit for the user
    const expenseLimit = await ExpenseLimit.findOne({ user: userId });
    console.log('Expense limit:', expenseLimit);

    if (!expenseLimit) {
      return responseHandler.error(res, 404, 'Expense limit not found for this user');
    }

    // Calculate the remaining amount
    const remainingAmount = expenseLimit.limit - (expenseLimit.totalExpenses || 0);
    console.log('Remaining amount:', remainingAmount);

    responseHandler.success(res, 200, {
      limit: expenseLimit.limit,
      totalExpenses: expenseLimit.totalExpenses || 0,
      remainingAmount,
    });
  } catch (error) {
    next(error); // Pass to the global error handler
  }
};

module.exports = { setExpenseLimit, getRemainingAmount };
