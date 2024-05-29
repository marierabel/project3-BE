const { Schema, model } = require("mongoose");

const validationSchema = new Schema({
  professor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "user is required"],
  },
  profValidation: {
    type: Boolean,
    default: false,
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "user is required"],
  },
  studValidation: {
    type: Boolean,
    default: false,
  },
});

const Validation = model("validation", validationSchema);

module.exports = Validation;
