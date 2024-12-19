class ExpenseService {
    constructor(ExpenseModel) {
      this.Expense = ExpenseModel;
    }
  
    async createExpense(expenseData, userId) {
      try {
        const expense = new this.Expense({
          ...expenseData,
          user: userId
        });
        return await expense.save();
      } catch (error) {
        throw new Error('Error creating expense');
      }
    }
  
    async getExpenses(userId) {
      try {
        return await this.Expense.find({ user: userId })
          .populate('category')
          .sort('-date');
      } catch (error) {
        throw new Error('Error fetching expenses');
      }
    }
  }
  
  module.exports = ExpenseService;