const { Schema, model } = require("mongoose");

const validationSchema = new Schema({
  conversation: {
    type: Schema.Types.ObjectId,
    ref: "Conversation",
    required: [true, "conversation is required"],
  },
  profValidation: {
    type: Boolean,
    default: false,
  },
  studValidation: {
    type: Boolean,
    default: false,
  },
});

const Validation = model("validation", validationSchema);

module.exports = Validation;
