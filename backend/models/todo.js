const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    },
    date: {
        type: Date,
        default: Date.now
    },
    completed: Boolean,
    content: String,
});

module.exports = mongoose.model('todo', todoSchema)