const entriesRouter = require("express").Router();

const validator = require("validator");
const loginRequired = require("../middleware/loginRequired");
const Habit = require("../models/habit");
const Entry = require("../models/entry");

entriesRouter.get("/:id", loginRequired, async (req, res) => {
  const id = req.params.id;

  try {
    var entry = await Entry.findById(id);
  } catch (error) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  if (!entry) {
    return res.status(404).json({ error: "No such entry exists" });
  }

  if (req.user._id.toString() !== entry.user.toString()) {
    return res.status(401).json({ error: "ID not found" });
  }

  res.status(200).json(entry);
});

/*
    Route to create and entry
*/
entriesRouter.post("/", loginRequired, async (req, res) => {
  const { emotions, date } = req.body;
  let newEntry;
  if (req.body.date) {
    if (validator.isDate(req.body.date)) {
      date = req.body.date.toDate();
      if (emotions) {
        newEntry = await Entry.create({ emotions, date });
      } else {
        newEntry = await Entry.create({ date });
      }
    } else {
      return res.status(400).json({ error: "Invalid Date" });
    }
  } else {
    if (emotions) {
      newEntry = await Entry.create({ emotions });
    } else {
      newEntry = await Entry.create({});
    }
  }
  try {
    const reoccurringHabits = newEntry.user.reoccurringHabits;
    //creating a habit object for each recurring habit
    for ([habitName, isBinary] of reoccurringHabits) {
      const habit = Habit.create({
        habitName,
        isBinary,
        date,
        user: req.user._id,
      });
      newEntry.habitsSelected.push(habit._id); //entering reference for current user
    }
    newEntry.habitsSelected = newEntry.habitsSelected.concat(
      req.user.longTermHabits
    );
    newEntry.user = req.user._id;
    req.user.entries.push(newEntry._id);
  } catch (error) {
    res.status(500).json({ error: "Unknown server error" });
  }
});

/*
    Route to edit an entry by id
*/
entriesRouter.put("/:id", loginRequired, async (req, res) => {
  const id = req.params.id;
  const emotions = req.body.emotions;
  try {
    var entry = await Entry.findById(id);
  } catch (error) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  if (!entry) {
    return res.status(404).json({ error: "No such entry exists" });
  }
  if (req.user._id.toString() !== entry.user.toString()) {
    return res.status(401).json({ error: "ID not found" });
  }
  if (!req.body.emotions) {
    return res.status(400).json({ error: "No Emotion Sent" });
  } else {
    if (emotions.isArray()) {
      //checking that emotions is an array
      emotions.foreach((emotionString) => {
        if (
          !(typeof emotionString == "string" || emotionString instanceof String)
        ) {
          return res
            .status(400)
            .json({ error: "Emotions is not an array of strings" });
        }
      });
    } else {
      return res
        .status(400)
        .json({ error: "Emotions property in body is not an array" });
    }
  }

  try {
    await Entry.findByIdAndUpdate(entry._id, { emotions: emotions });
  } catch (error) {
    return res.status(400).json({ error: "Malformed request" });
  }
  res.status(204).end();
});

/*
    Route to delete an entry by id
*/
entriesRouter.delete("/:id", loginRequired, async (req, res) => {
  const id = req.params.id;
  try {
    var entry = await Entry.findById(id);
  } catch (error) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  if (!entry) {
    return res.status(404).json({ error: "No such entry exists" });
  }
  if (req.user._id.toString() !== entry.user.toString()) {
    return res.status(401).json({ error: "ID not found" });
  }

  try {
    await findByIdAndDelete(entry._id);
    const index = req.user.entries.findIndex(entry._id);
    if (index > -1) {
      req.user.entries.splice(index, 1); //remove 1 element at index index
    }
  } catch (error) {
    return res.status(400).json({ error: "Malformed request" });
  }
  res.status(204).end();
});

/*
    Route to create a habit for a specific entry (as oppossed to at the user level)
*/
entriesRouter.post("/:id", loginRequired, async (req, res) => {
  const id = req.params.id;
  try {
    var entry = await Entry.findById(id);
  } catch (error) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  if (!entry) {
    return res.status(404).json({ error: "No such entry exists" });
  }
  if (req.user._id.toString() !== entry.user.toString()) {
    return res.status(401).json({ error: "ID not found" });
  }

  const { name, isBinary } = req.body;
  if (!name || !isBinary) {
    return res
      .status(400)
      .json({ error: "Missing habit name or isBinary property" });
  }
  const habit = {};
  const fields = ["name", "isBinary"];
  for (let field of fields) {
    if (req.body[field]) {
      if (field === "isBinary") {
        habit[field] = Boolean(req.body[field]);
      } else {
        habit[field] = req.body[field];
      }
    }
  }

  try {
    const newHabit = await Habit.create(habit);
    const habitID = newHabit._id;

    entry.habitsSelected.push(habitID);
    req.user.reoccurringHabits.set(habit.name, habit.isBinary);
  } catch (error) {
    res.status(500).json({ error: "Unknown server error" });
  }
  res.status(204).end();
});

module.exports = entriesRouter;
