const express = require('express'); 
const userModel = require('./models/user'); 
const todoModel = require('./models/todo');
const app = express(); 
const path = require('path'); 
const cors = require('cors'); 
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config(); 

app.use(cors({
    origin: 'http://localhost:5173', // Frontend origin
    credentials: true // Allow cookies to be included
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(cookieParser());

function isLoggedIn(req, res, next) {
    if (!req.cookies.token) {
        return res.status(401).json({ message: 'Login First' });
    }

    try {
        let data = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        req.user = data;
        next();
    } catch (e) {
        return res.status(401).send('Invalid token. Please login again.');
    }
}
app.get('/', (req, res)=>{
    res.send('Working')
})
app.post('/register', async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    try {
        let user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        let createdUser = await userModel.create({
            firstname,
            lastname,
            email,
            password: hash
        });

        let token = jwt.sign({ email, createdUserid: createdUser._id }, 'shhhh', { expiresIn: '1h' });

        res.cookie('token', token);
        res.status(201).json({ message: 'User registered successfully', user: createdUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating user' });
    }
});

app.post('/signin', async (req, res) => {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            let token = jwt.sign({ email, userid: user._id }, 'shhhh', { expiresIn: '1h' });
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'lax',
                secure: false
            });
            res.status(201).json({ message: 'Sign in successful', user });
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    });
});

app.post('/todo', isLoggedIn, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        let todo = await todoModel.create({
            user: user._id,
            content: req.body.content,
            completed: false
        });

        user.todos.push(todo._id);
        await user.save();
        res.json('Todo added successfully');
    } catch (e) {
        res.status(500).json({ message: 'Error adding todo' });
    }
});

app.get('/todo', isLoggedIn, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email }).populate('todos');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ todos: user.todos, name: user.firstname });
    } catch (e) {
        res.status(500).json({ message: 'Error retrieving todos' });
    }
});

// New delete route
app.delete('/todo/:id', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;

        // Find the user and the todo to delete
        let user = await userModel.findOne({ email: req.user.email }).populate('todos');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let todo = await todoModel.findById(id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        // Remove todo from user's todos list
        user.todos = user.todos.filter(todoId => todoId.toString() !== id);
        await user.save();

        // Delete the todo
        await todoModel.findByIdAndDelete(id);

        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (e) {
        res.status(500).json({ message: 'Error deleting todo' });
    }
});

app.get('/logout', async (req, res) => {
    res.cookie('token', '', {
        expires: new Date(0),
        path: '/',
        sameSite: 'lax'
    });
    res.status(200).json({ message: 'Logged out successfully' });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
