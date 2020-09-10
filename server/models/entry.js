const env = require("../config/environment");
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { formatDate } = require("../utils/utils");

const entrySchema = new mongoose.Schema({
    emotion: { type: String, required: true },
    habitSelected: {type: mongoose.Schema.Types.ObjectId, ref: "Habit"},
    date: {type: Date, required: true, default: Date.now},
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

        returnedObject.date = formateDate(returnedObject.date);
    }
});

entrySchema.plugin(uniqueValidator);

module.exports = mongoose.model("Entry", entrySchema);
