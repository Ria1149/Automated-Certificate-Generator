const mongoose = require('mongoose')

const excelData = new mongoose.Schema({
    name:{type:String},
     mobile_number :{type:Number},
     email :{type:String},
     amount:{type:Number},
    no_of_trees : {type:Number}
})


module.exports = mongoose.model("exceltojsondata",excelData);