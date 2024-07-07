const mongoose = require('mongoose');

// Replace <password> with your actual password
const uri = 'mongodb+srv://admin01:admin01@database.ibr7v7c.mongodb.net/?retryWrites=true&w=majority&appName=Database';

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
