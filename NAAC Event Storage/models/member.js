const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create user model
const MemberSchema = new Schema({
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
    ParentId : {
        type : mongoose.Types.ObjectId,
        ref : 'User'
    },
    active : {
        type : Boolean,
        default : false
    },
    expiredAt : {
        type : Date,
    },
    template : [
        {
            type: mongoose.Types.ObjectId,
            ref : 'Template'
        }
    ],
    
});

//register user model with mongoose and export default
const Member = mongoose.model('Member', MemberSchema);

module.exports = Member;
