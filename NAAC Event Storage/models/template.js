const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create user model
const TemplateSchema = new Schema(
  {
    // islive: {
    //   type: Boolean,
    //   default: false,
    // },
    isComplete: {
      type: Boolean,
      default: false,
    },
    isAccepting: {
      type: Boolean,
      default: true,
    },
    // isActive: {
    //   type: Boolean,
    //   default: true,
    // },
    name: {
      type: String,
      trim: true,
      minLength: 2,
    },
    layout: [],
    handle: {
      publish: {
        type: Object,
      },
      role: {
        type: Object,
      },
      indexRole: {
        type: Object,
      },
    },
  },
  {
    timestamps: true,
  }
);

//register user model with mongoose and export default
const Meta = mongoose.model("Template", TemplateSchema);

module.exports = Meta;
