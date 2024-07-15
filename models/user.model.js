const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
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
      },
      totRating:{
            type: Number,
            require:false,
            default: 0
      },
      countRating:{
            type: Number,
            require:false,
            default: 0
      },
      averageRating:{
            type: Number,
            require:false,
            default: 0
      },
      review:{
            type: [String],
            require: false,
            default: []
      }

})

userSchema.pre('save',async function(next){
      try {
            const salt = await bcrypt.genSalt(10)
            this.password = await bcrypt.hash(this.password,salt)
            this.confirmPassword = await bcrypt.hash(this.confirmPassword,salt)
            
      } catch (error) {
            next(error);
      }
})

module.exports = mongoose.model("user",userSchema)