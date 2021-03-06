const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create user model
const UserSchema = new Schema({
    role : {
        type : String,
        required : true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        minLength : 2
    },
    email: {
        type : String,
        required : [true,"*Email is required"],
        lowercase: true,
        trim: true,
        unique: true,
        validate: {
            validator: (email)=>{
              return /[a-zA-Z0-9_\.\+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]+/.test(email);
            },
            message: '{VALUE} is not a valid email!'
          }
    },
    salt : {
        type : String
    },
    password: {
        type: String
    },
    keywords: [],
    template : [
        {
            type: mongoose.Types.ObjectId,
            ref : 'Template'
        }
    ],
    members : [
        {
            type: mongoose.Types.ObjectId,
            ref : 'Member'
        }
    ],
},{
    timestamps : true
});

//register user model with mongoose and export default
const User = mongoose.model('User', UserSchema);

module.exports = User;
