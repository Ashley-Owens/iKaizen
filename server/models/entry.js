const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const formatDate = require("../utils/formatDate");

const entrySchema = new mongoose.Schema({
  emotions: [{ type: String }],
  date: { type: Date, unique: true, required: true, default: Date.now },
  habitsSelected: [{ type: mongoose.Schema.Types.ObjectId, ref: "Habit" }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

entrySchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;

    returnedObject.date = formatDate(returnedObject.date);
  },
});

entrySchema.plugin(uniqueValidator);

module.exports = mongoose.model("Entry", entrySchema);
