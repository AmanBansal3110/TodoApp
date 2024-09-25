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
        let data = jwt.verify(req.cookies.token, process.env.JWT_SECRET); // Use environment variable
        req.user = data;
        next();
    } catch (e) {
        console.error('JWT verification failed:', e);
        return res.status(401).json({ message: 'Invalid token. Please login again.' });
    }
}

app.get('/', (req, res) => {
    res.send('Working');
});

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

        let token = jwt.sign({ email, createdUserid: createdUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Use secret from env

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production'
        });
        res.status(201).json({ message: 'User registered successfully', user: createdUser });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Error creating user' });
    }
});

app.post('/signin', async (req, res) => {
    let { email, password } = req.body;
    try {
        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        let isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            let token = jwt.sign({ email, userid: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production'
            });
            res.status(200).json({ message: 'Sign in successful', user });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('Error during signin:', err);
        res.status(500).json({ message: 'Error signing in' });
    }
});

// Similar updates should be applied to /todo, /todo/:id, and /logout routes
// For brevity, I'm not repeating them.

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
