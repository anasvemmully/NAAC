const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create user model
const OTPSchema = new Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (email) => {
        return /[a-zA-Z0-9_\.\+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]+/.test(email);
      },
      message: "{VALUE} is not a valid email!",
    },
  },
  otp: {
    type: String,
    trim: true,
  },
  expiresAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//register user model with mongoose and export default
const Member = mongoose.model("OTP", OTPSchema);

module.exports = Member;
