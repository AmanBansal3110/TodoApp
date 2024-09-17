const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/project')

const userModel = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    todos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'todo'
        }
    ]
});

module.exports = mongoose.model('user', userModel);