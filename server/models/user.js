const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const formatDate = require("../utils/formatDate");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  email: { type: String },
  dateCreated: { type: Date, default: Date.now },
  reoccurringHabits: { type: Map, of: Boolean, default: {} },
  longTermHabits: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
    },
  ],
  entries: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entry",
    },
  ],
  appleId: { type: String },
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();

    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;

    returnedObject.dateCreated = formatDate(returnedObject.dateCreated);
  },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
