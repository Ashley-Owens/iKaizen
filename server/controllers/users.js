const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const passport = require("passport");
const loginRequired = require("../middleware/loginRequired");
const checkForCredentials = require("../utils/checkForCredentials");
const getWeekday = require("../utils/getWeekday");
const User = require("../models/user");
const Entry = require("../models/entry");
const Habit = require("../models/habit");

usersRouter.post("/", async (req, res) => {
  const { username, password, email, firstName, lastName } = req.body;
  const { credentialsProvided, message } = checkForCredentials(
    username,
    password
  );

  if (!credentialsProvided) {
    return res.status(400).json({ error: message });
  }

  const passwordHash = await bcrypt.hash(password, 14);

  try {
    var newUser = await User.create({
      firstName,
      lastName,
      username,
      passwordHash,
      email,
    });
  } catch (error) {
    res.status(400).json({ error: "malformed request body" });
  }

  res.status(201).json(newUser);
});

usersRouter.put("/myself", loginRequired, async (req, res) => {
  const userEdit = {};
  const fields = [
    "username",
    "firstName",
    "lastName",
    "email",
    "password",
    "appleId",
  ];

  for (let field of fields) {
    if (req.body[field]) {
      if (field === "password") {
        const passwordHash = await bcrypt.hash(req.body.password, 14);
        userEdit.passwordHash = passwordHash;
      } else {
        userEdit[field] = req.body[field];
      }
    }
  }

  if (Object.keys(userEdit).length === 0) {
    return res.status(400).json({ error: "No required fields were provided" });
  }

  try {
    await User.findByIdAndUpdate(req.user._id, userEdit);
  } catch (error) {
    return res
      .status(400)
      .json({ error: "At least one edit field is invalid" });
  }

  return res.status(204).end();
});

usersRouter.get("/my/entries", loginRequired, async (req, res) => {
  if (Object.keys(req.query).length === 0) {
    return res.status(400).json({ error: "No date query entered" });
  }

  const { year, month, day, view } = req.query;

  const userID = req.user._id;

  if (view === "weekly") {
    const firstDayOfCurrentWeek = getWeekday({ day: 0, atMidnight: true });
    const firstDayOfNextWeek = getWeekday({ day: 7, atMidnight: true });

    var weekEntries = await Entry.find({
      user: userID,
      date: { $gte: firstDayOfCurrentWeek, $lt: firstDayOfNextWeek },
    }).populate("habitsSelected", "-user -entries");

    return res.json(weekEntries);
  } else if (view === "monthly") {
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const tomorrow = new Date();
    tomorrow.setDate(new Date().getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    var monthEntries = await Entry.find({
      user: userID,
      date: { $gte: firstDayOfMonth, $lt: tomorrow },
    }).populate("habitsSelected", "-user -entries");

    return res.json(monthEntries);
  } else {
    if (!year || !month) {
      return res.status(400).json({ error: "Invalid date query" });
    }

    const monthIndex = Number(month) - 1;

    if (!day) {
      if (validator.isDate(`${year}/${month}/01`)) {
        var searchEntriesNoDay = await Entry.find({
          user: userID,
          date: {
            $gte: new Date(year, monthIndex, 1),
            $lt: new Date(year, month, 1),
          },
        }).populate("habitsSelected", "-user -entries");

        if (searchEntriesNoDay.length === 0) {
          return res
            .status(404)
            .json({ error: "No entries exist in the specified month" });
        }

        return res.json(searchEntriesNoDay);
      }

      return res.status(400).json({ error: "Invalid date query" });
    }

    if (validator.isDate(`${year}/${month}/${day}`)) {
      var searchEntriesWithDay = await Entry.findOne({
        user: userID,
        date: {
          $gte: new Date(year, monthIndex, day),
          $lt: new Date(year, monthIndex, day + 1),
        },
      }).populate("habitsSelected", "-user -entries");

      if (!searchEntriesWithDay) {
        return res
          .status(404)
          .json({ error: "No entry exists on the specified day" });
      }

      return res.json(searchEntriesWithDay);
    } else {
      return res.status(400).json({ error: "Invalid date query" });
    }
  }
});

usersRouter.post("/my/habits", loginRequired, async (req, res) => {
  let isReoccurring = true;

  if (req.query.isLongTerm !== "true" && req.query.isLongTerm !== "false") {
    //testing if they pass isLongTerm and it is valid
    return res.status(400).json({ error: "Invalid query string" });
  } else {
    isReoccurring = req.query.isLongTerm === "false";
  }

  const { name, isBinary } = req.body;

  if (!name || (!isBinary && typeof isBinary !== "boolean")) {
    return res
      .status(400)
      .json({ error: "Name or isBinary not given in request" });
  }

  const habit = { user: req.user._id, name, isBinary };

  // if (name) habit.name = name;
  // if (typeof isBinary === "boolean") habit.isBinary = isBinary;

  try {
    if (!isReoccurring) {
      var newHabit = await Habit.create(habit);
      req.user.longTermHabits.push(newHabit._id);

      await req.user.save();

      return res.status(201).json(newHabit);
    } else {
      //is reaccuring
      req.user.reoccurringHabits.set(habit.name, habit.isBinary);

      await req.user.save();
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(201).end();
});

usersRouter.post("/login", passport.authenticate("local"), async (req, res) => {
  res.status(200).end();
});

usersRouter.post("/logout", async (req, res) => {
  req.logout();
  res.status(200).end();
});

usersRouter.get("/my/session", (req, res) => {
  // if a req.user object exists, then the client sent a valid session ID
  if (req.user) {
    return res.json({ authenticated: true });
  }

  res.json({ authenticated: false });
});

usersRouter.use((err, req, res, next) => {
  return res.status(500).json({
    error: "an error occurred on the server ",
  });
});

module.exports = usersRouter;
