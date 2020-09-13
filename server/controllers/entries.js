const entriesRouter = require("express").Router();

const loginRequired = require("../middleware/loginRequired");
const predefinedEmotions = require("../static/emotions");
const Habit = require("../models/habit");
const Entry = require("../models/entry");
const User = require("../models/user");

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
    Route to create an entry
*/
entriesRouter.post("/", loginRequired, async (req, res) => {
  let { date } = req.body;
  const user = req.user;

  let newEntry;

  try {
    if (date) {
      date = new Date(date);

      if (date.toString() === "Invalid Date") {
        return res.status(400).json({ error: "Invalid Date" });
      }

      date.setHours(0, 0, 0, 0);
      newEntry = await Entry.create({ date, user: user._id });
    } else {
      newEntry = await Entry.create({ user: user._id });
    }
  } catch (error) {
    return res.status(500).json({ error: "Unknown server error" });
  }

  user.entries.push(newEntry._id);

  try {
    const reoccurringHabits = user.reoccurringHabits;

    for (const [habitName, isBinary] of reoccurringHabits) {
      const habit = await Habit.create({
        name: habitName,
        isBinary,
        date,
        user: user._id,
        entries: [newEntry._id],
      });

      newEntry.habitsSelected.push(habit._id);
    }

    for (const longTermHabitId of user.longTermHabits) {
      const longTermHabit = await Habit.findById(longTermHabitId);

      longTermHabit.entries.push(newEntry._id);

      await longTermHabit.save();
    }

    newEntry.habitsSelected = newEntry.habitsSelected.concat(
      user.longTermHabits
    );
  } catch (error) {
    await Entry.findByIdAndDelete(newEntry._id);
    return res.status(500).json({ error: "Unknown server error" });
  }

  await newEntry.save();
  await user.save();

  newEntry = await newEntry.populate("habitsSelected").execPopulate();

  res.status(201).json(newEntry);
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
  }

  if (!Array.isArray(emotions)) {
    return res
      .status(400)
      .json({ error: "Emotions property in body is not an array" });
  }

  //checking that emotions is an array
  for (const emotion of emotions) {
    if (!(typeof emotion == "string" || emotion instanceof String)) {
      return res
        .status(400)
        .json({ error: "Emotions is not an array of strings" });
    }
  }

  let predefinedEmotionSet = new Set(
    predefinedEmotions.map((emotion) => emotion.name)
  );

  for (const emotion of emotions) {
    if (!predefinedEmotionSet.has(emotion)) {
      return res
        .status(400)
        .json({ error: `${emotion} is not a valid emotion` });
    }
  }

  try {
    await Entry.findByIdAndUpdate(entry._id, { emotions });
  } catch (error) {
    return res.status(400).json({ error: "Malformed request" });
  }

  res.status(204).end();
});

/*
    Route to delete an entry by id
*/
entriesRouter.delete("/:id", loginRequired, async (req, res) => {
  const user = req.user;
  const id = req.params.id;

  try {
    var entry = await Entry.findById(id);
  } catch (error) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  if (!entry) {
    return res.status(404).json({ error: "No such entry exists" });
  }

  if (user._id.toString() !== entry.user.toString()) {
    return res.status(401).json({ error: "ID not found" });
  }

  try {
    const habitIds = entry.habitsSelected;

    for (let habitId of habitIds) {
      if (!user.longTermHabits.includes(habitId)) {
        await Habit.findByIdAndDelete(habitId);
      } else {
        await Habit.findByIdAndUpdate(habitId, {
          $pull: { entries: entry._id },
        });
      }
    }

    await Entry.findByIdAndDelete(entry._id);
    await User.findByIdAndUpdate(user._id, { $pull: { entries: entry._id } });
  } catch (error) {
    return res.status(400).json({ error: "Malformed request" });
  }

  res.status(204).end();
});

/*
    Route to create a habit for a specific entry (as oppossed to at the user level)
*/
entriesRouter.post("/:id/habits", loginRequired, async (req, res) => {
  const user = req.user;
  const id = req.params.id;

  try {
    var entry = await Entry.findById(id);
  } catch (error) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  if (!entry) {
    return res.status(404).json({ error: "No such entry exists" });
  }

  const userEntryIds = user.entries.map((entryId) => entryId.toString());

  if (!userEntryIds.includes(id)) {
    return res.status(401).json({ error: "ID not found" });
  }

  const { name, isBinary } = req.body;

  if (!name || (!isBinary && typeof isBinary !== "boolean")) {
    return res
      .status(400)
      .json({ error: "Missing habit name or isBinary property" });
  }

  const habit = { user: user._id, entries: [entry._id], name, isBinary };

  try {
    var newHabit = await Habit.create(habit);
    const habitID = newHabit._id;

    entry.habitsSelected.push(habitID);
    await entry.save();
  } catch (error) {
    res.status(400).json({ error: "Malformed request" });
  }

  res.status(201).json(newHabit);
});

module.exports = entriesRouter;
