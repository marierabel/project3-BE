const { Schema, model } = require("mongoose");

const conversationSchema = new Schema({
  title: { type: String },
  student: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "user is required"],
  },
  lesson: {
    type: Schema.Types.ObjectId,
    ref: "Lesson",
    required: [true, "lesson is required"],
  },
});

const Conversation = model("conversation", conversationSchema);

module.exports = Conversation;
