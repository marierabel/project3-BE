const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, "email is already used"],
  },
  //RegEx email à faire
  password: {
    type: String,
    required: [true, "password is required"],
  },
  name: {
    type: String,
    required: [true, "name is required"],
  },
  pseudo: {
    type: String,
    required: [true, "pseudo is required"],
    unique: [true, "this pseudo is already taken"],
  },
  bio: {
    type: String,
    minLength: [30, "description must be at least 30 characters long"],
    maxLength: [300, "description must not exceed 300 characters"],
  },
  tickets: {
    type: Number,
    default: 2,
    min: 0,
  },
  lessonMarked: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
});

const User = model("User", userSchema);

module.exports = User;
