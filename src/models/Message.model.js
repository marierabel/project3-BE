const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    title: {
      type: String,
      minLength: [5, "title must be at least 5 characters long"],
      maxLength: [50, "title must not exceed 50 characters"],
    },
    content: {
      type: String,
      required: [true, "content is required"],
      maxLength: [400, "content must not exceed 300 characters"],
    },
    envoy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
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
    readAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Message = model("message", messageSchema);

module.exports = Message;
