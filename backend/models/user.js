const mongoose = require('mongoose');
const config = require('config')

const connectDB = async () =>{
    try{
        await mongoose.connect(`${config.get("MONGODB_URI")}`);
        console.log('MongoDB connected...');
    }catch(err){
        console.error('MongoDB connection failed:', err.message)
        process.exit(1);
    }
} 
connectDB();
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