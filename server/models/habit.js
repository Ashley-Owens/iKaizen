const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const formatDate = require("../utils/formatDate");

const habitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  progress: { type: Number, required: true, default: 0, min: 0, max: 100 },
  date: { type: Date, default: Date.now },
<<<<<<< HEAD
  isBinary: {type: Boolean, required: true},
  isArchived: {type: Boolean, required: true},
=======
  isBinary: { type: Boolean, required: true },
  isArchived: { type: Boolean, required: true },
>>>>>>> 17e8c7be1340cb7acbafe0df2914bc974a90da55
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  entries: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entry",
    },
  ],
});

habitSchema.set("toJSON", {
  transform: (document, returnedObect) => {
    returnedObect.id = returnedObject._id.toString();
    delete returnedObect._id;
    delete returnedObect.__v;

    returnedObject.date = formatDate(returnedObject.date);
  },
});

habitSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Habit", habitSchema);
