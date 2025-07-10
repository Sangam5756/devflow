const mongoose = require('mongoose');
const { MONGO_URI } = require('./server.config');

const connectDB = async ()=>{
    try {
        await mongoose.connect(MONGO_URI);
    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
    }
}

module.exports = connectDB;