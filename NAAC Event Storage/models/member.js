const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create user model
const MemberSchema = new Schema({
    ParentId : {
        type : mongoose.Types.ObjectId,
        ref : 'User'
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
