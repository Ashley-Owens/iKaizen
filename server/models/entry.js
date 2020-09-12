const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const formatDate = require("../utils/formatDate");

const entrySchema = new mongoose.Schema({
  emotions: [{ type: String}],
  date: { type: Date, unique: true, required: true, default: Date.now },
  habitsSelected: [{ type: mongoose.Schema.Types.ObjectId, ref: "Habit" }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
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
