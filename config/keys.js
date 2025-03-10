require('dotenv').config();
module.exports = {
    MongoURI: process.env.MONGODBURL || 'mongodb://localhost:27017', // MongoDB connection string


}
