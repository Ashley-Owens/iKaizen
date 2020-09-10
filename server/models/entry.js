const env = require("../config/environment");
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const formatDate = require("../utils/formatDate");

const entrySchema = new mongoose.Schema({
<<<<<<< HEAD
    emotion: { type: String, required: true },
    habitSelected: {type: mongoose.Schema.Types.ObjectId, ref: "Habit"},
    date: {type: Date, required: true, default: Date.now},
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
=======
  emotion: { type: String, unique: false, required: true },
  habitSelected: { type: String, unique: false, required: false },
  date: { type: Date, unique: true, required: true, default: Date.now },
  isActive: { type: Boolean, unique: false, required: true, default: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
>>>>>>> e0375ffd5689c03a17472cc5527d66031e86d6a7
});

entrySchema.set("toJSON", {
  transform: (document, returnedObect) => {
    returnedObect.id = returnedObject._id.toString();
    delete returnedObect._id;
    delete returnedObect.__v;

    returnedObject.date = formatDate(returnedObject.date);
  },
});

entrySchema.plugin(uniqueValidator);

module.exports = mongoose.model("Entry", entrySchema);
