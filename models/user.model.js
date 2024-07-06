const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
      fullname:{
            type:String,
            require:true
      },
      username:{
            type:String,
            require:true
      },
      email:{
            type:String,
            require:true
      },
      phoneNumber:{
            type:String,
            require:true
      },
      password:{
            type:String,
            require:true
      },
      confirmPassword:{
            type:String,
            require:true
      },
      address:{
            type:String,
            require:true
      },
      role:{
            type:String,
            require:true
      },
      gender:{
            type:String,
            require:true
      },
      photo:{
            type:String,
            require:false
      }

})

module.exports = mongoose.model("user",userSchema)