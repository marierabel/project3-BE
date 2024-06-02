const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, "content is required"],
      maxLength: [400, "content must not exceed 300 characters"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: [true, "conversation is required"],
    },
    readAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Message = model("message", messageSchema);

module.exports = Message;
