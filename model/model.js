const mongoose = require("mongoose")
let ObjectId = mongoose.Schema.Types.ObjectId


const studentSchema = new mongoose.Schema({

    name: {type: String,required: true},
    phone_number : {type: Number, required: true, unique:true},
    email : {type: String, required: true, unique:true},
    field : {type: String, required: true},
    country: {type: String, required: true},
    coutry_code : {type: Number, required: true},
   
}, { timestamps: true })

module.exports = mongoose.model("student", studentSchema)

