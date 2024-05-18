const mongoose = require('mongoose')
const config = require('config');

const url = config.get('DB_STRING');

exports.connectToMongo = ()=>{
    mongoose.connect(url)
    .then(()=>{console.log("Database connected succesfully")})
    .catch(()=>{console.log("Database not connected ")})
}