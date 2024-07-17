const mongoose = require("mongoose");


const otpSchema = new mongoose.Schema({

    email : String,
    otp:String
},{     
    expireAfterSeconds: 120
});

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp