const { Schema, model } = require("mongoose");

const validationSchema = new Schema(
  {
    conversationId: {
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
  },
  { timestamps: true }
);

const Validation = model("validation", validationSchema);

module.exports = Validation;
