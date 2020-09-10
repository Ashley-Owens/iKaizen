const env = require("../config/environment");
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const formatDate = require("../utils/formatDate");

const entrySchema = new mongoose.Schema({
  emotion: { type: String, unique: false, required: true },
  habitSelected: { type: String, unique: false, required: false },
  date: { type: Date, unique: true, required: true, default: Date.now },
  isActive: { type: Boolean, unique: false, required: true, default: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
