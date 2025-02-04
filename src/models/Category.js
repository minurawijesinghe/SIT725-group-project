const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    color: {
        type: String,
        default: '#000000'
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;