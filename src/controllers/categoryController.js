const Category = require('../models/Category');
const responseHandler = require('../utils/responseHandler');

const categoryController = {
    getCategories: async (req, res) => {
        try {
            const categories = await Category.find({ user: req.user._id });
            responseHandler.success(res, 200, categories);
        } catch (error) {
            responseHandler.error(res, 500, error.message);
        }
    },

    createCategory: async (req, res) => {
        try {
            const category = new Category({
                ...req.body,
                user: req.user._id
            });
            await category.save();
            responseHandler.success(res, 201, category, 'Category created successfully');
        } catch (error) {
            responseHandler.error(res, 400, error.message);
        }
    },

    updateCategory: async (req, res) => {
        try {
            const category = await Category.findOneAndUpdate(
                { _id: req.params.id, user: req.user._id },
                req.body,
                { new: true }
            );
            if (!category) {
                return responseHandler.error(res, 404, 'Category not found');
            }
            responseHandler.success(res, 200, category, 'Category updated successfully');
        } catch (error) {
            responseHandler.error(res, 400, error.message);
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const category = await Category.findOneAndDelete({
                _id: req.params.id,
                user: req.user._id
            });
            if (!category) {
                return responseHandler.error(res, 404, 'Category not found');
            }
            responseHandler.success(res, 200, null, 'Category deleted successfully');
        } catch (error) {
            responseHandler.error(res, 500, error.message);
        }
    },

    getCategory: async (req, res) => {
        try {
            const category = await Category.findOne({
                _id: req.params.id,
                user: req.user._id
            });
            if (!category) {
                return responseHandler.error(res, 404, 'Category not found');
            }
            responseHandler.success(res, 200, category);
        } catch (error) {
            responseHandler.error(res, 500, error.message);
        }
    }
};

module.exports = categoryController;