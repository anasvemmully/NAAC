const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create user model
const MetaSchema = new Schema({
    _id : {
        type : mongoose.Types.ObjectId,
        ref : 'User'
    },
    // currentTemplate : {
    //     type : mongoose.Types.ObjectId,
    //     ref : "Template"
    // },
    template : [
        {
            type: mongoose.Types.ObjectId,
            ref : 'Template'
        }
    ],
    
});

//register user model with mongoose and export default
const Meta = mongoose.model('Meta', MetaSchema);

module.exports = Meta;
