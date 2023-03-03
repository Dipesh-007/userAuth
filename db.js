const mongoose = require('mongoose');

const mongoURI = "mongodb://127.0.0.1:27017/User"

const connectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to Mongo Successfully");
    })
}

module.exports = connectToMongo;         