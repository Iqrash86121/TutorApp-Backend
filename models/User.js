const mongoose = require("mongoose");
const User = new mongoose.Schema({
    name: {
        type: String,
        min: 6,
        max: 15,
    },
    email: {
        type: String,
        min: 6,
        max: 20,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        min: 6,
        max: 20,

        required: true,
    },
    resetToken: {
        type: String,
      },
      resetTokenExpiration: {
        type: Date,
      }
    

},
{ timestamps: true }
)
module.exports=mongoose.model("user",User)