const ExpenseLimit = require('../models/expenseLimit');

const setExpenseLimit = async (req, res, next) => {
  try {
    const { user, limit } = req.body;

    // Check if the user already has a limit
    let expenseLimit = await ExpenseLimit.findOne({ user });

    if (expenseLimit) {
      // Update the existing limit
      expenseLimit.limit = limit;
      await expenseLimit.save();
    } else {
      // Create a new limit
      expenseLimit = await ExpenseLimit.create({ user, limit });
    }

    res.status(200).json({ success: true, data: expenseLimit });
  } catch (error) {
    next(error);
  }
};

module.exports = { setExpenseLimit };
