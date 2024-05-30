const { Schema, model } = require("mongoose");

const lessonSchema = new Schema({
  title: {
    type: String,
    required: [true, "title is required"],
    minLength: [5, "title must be at least 5 characters long"],
    maxLength: [50, "title must not exceed 50 characters"],
  },
  content: {
    type: String,
    required: [true, "content is required"],
    maxLength: [300, "content must not exceed 300 characters"],
  },
  professor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "professor is required"],
  },
  durationInMin: {
    type: Number,
    enum: [45, 60],
  },
  field: {
    type: String,
    enum: [
      "academic",
      "music",
      "sport",
      "well-being",
      "cooking",
      "crafting",
      "sciences",
      "languages",
      "esthetics",
      "arts",
      "IT",
      "danse",
      "repair",
      "other",
    ],
    required: [true],
  },
  keyword: {
    type: [String],
    default: undefined,
    required: [true, "keyword is required"],
    validate: {
      validator: (keys) => keys.length <= 4 && keys.length > 0,
      message: "1 keyword is required (max. 4 keywords)", // error message if validation fails
    },
  },
});

const Lesson = model("Lesson", lessonSchema);

module.exports = Lesson;
