const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
  name:{
      type: String,
      required:true,
      trim:true
  },
  email:{
    type: String,
    required:true,
    trim:true
  },
  hashed_password:{
    type: String,
    required:true,
    
  },
  salt: String,
  created:{
      type:Date,
      default: Date.now
  },
  role: {
    type: String,
    default: "subscriber"
},
  update: Date

})

userSchema.virtual('password')
.set(function(password){
    this._password = password
    //to generate a timestamp
    this.salt = uuidv4()
    //encryptPassword
    this.hashed_password = this.encryptPassword(password)
})
.get(function(){
    return this_.password
})

userSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    encryptPassword: function(password){
        if(!password) 
        return "";

        try {
            return crypto.createHmac('sha256', this.salt)
            .update(password)
            .digest('hex');
        } catch (err) {
            return "";
        }
    }
}

module.exports = mongoose.model("User", userSchema)

