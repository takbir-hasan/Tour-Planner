const mongoose = require("mongoose");

const booking = mongoose.Schema({
     
      username:{
            type:String,
            require:true
      },
      
      phoneNumber:{
            type:String,
            require:true
      },
      address:{
            type:String,
            require:true
      },
      date:{
            type:Date,
            default:Date.now
      },
      service:{
            type:String,
            require:true
      }
})

// module.exports = mongoose.model("booking",booking)