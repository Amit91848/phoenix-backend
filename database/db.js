const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const mongoURI = process.env.mongoURI;

const connectDb = async () => {
    try {
        mongoose.connect(mongoURI);
        console.log('db connected');
    } catch(err) {
        console.log(err);
    }
}

module.exports = {
    connectDb
}