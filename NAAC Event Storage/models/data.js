const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create user model
const DataSchema = new Schema({
    data : {
        type : Object
    }
});

//register user model with mongoose and export default
const Meta = mongoose.model('Data', DataSchema);

module.exports = Meta;
