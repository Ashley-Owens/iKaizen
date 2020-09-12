const habitsRouter = require("express").Router();
const loginRequired = require("../middleware/loginRequired");
const User = require("../models/user");
const Entry = require("../models/entry");
const Habit = require("../models/habit");

//Editing Habit by ID
habitsRouter.put("/:id", loginRequired, async (req, res) => {
  const id = req.params.id;

  //Case 1
  try {
    var habit = await Habit.findById(id);
  } catch (error) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  //Case 2
  if (!habit) {
    return res.status(404).json({ error: "No such habit exists" });
  }

  //Case 3
  if (req.user._id.toString() !== habit.user.toString()) {
    return res.status(401).json({ error: "ID not found" });
  }

  const { name, progress, isBinary, isArchived } = req.body;
  if (!name && !progress && !isBinary && !isArchived) {
    return res.status(204).end();
  }

  const habitEdit = {};
  const fields = ["name", "progress", "isBinary", "isArchived"];

  for (let field of fields) {
    if (req.body[field] || typeof req.body[field] === "boolean") {
      habitEdit[field] = req.body[field];
    }
  }

  try {
    await Habit.findByIdAndUpdate(habit._id, habitEdit);
  } catch (error) {
    return res.status(400).json({ error: "Malformed request" });
  }

  res.status(204).end();
});

habitsRouter.delete("/:id", loginRequired, async (req, res) => {
  const id = req.params.id;

  //Case 1
  try {
    var habit = await Habit.findById(id);
  } catch (error) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  //Case 2
  if (!habit) {
    return res.status(404).json({ error: "No such habit exists" });
  }

  //Case 3
  if (req.user._id.toString() !== habit.user.toString()) {
    return res.status(401).json({ error: "ID not found" });
  }

  /*
    1. Need user who owns the habit
    2. Entry that owns the habit
    */

  try {
    await Habit.findByIdAndDelete(habit._id);

    const userID = habit.user;
    const entryIDs = habit.entries;

    await User.update(
      { _id: userID },
      { $pull: { longTermHabits: habit._id } }
    );

    await Entry.updateMany(
      { _id: { $in: entryIDs } },
      { $pull: { habitsSelected: habit._id } }
    );
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }

  res.status(204).end();
});

module.exports = habitsRouter;
