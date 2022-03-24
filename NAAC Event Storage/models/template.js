const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create user model
const TemplateSchema = new Schema(
  {
    islive: {
      type: Boolean,
      default: false,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
    },
    layout: [],
    handle: {
      publish: [],
      role: {},
    },
  },
  {
    timestamps: true,
  }
);

//register user model with mongoose and export default
const Meta = mongoose.model("Template", TemplateSchema);

module.exports = Meta;
