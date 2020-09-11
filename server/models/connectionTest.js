const env = require("../config/environment");
const mongoose = require("mongoose");
const Entry = require("./entry");
const User = require("./user");
const Habit = require("./habit");

mongoose.connect(env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

(async () => {
  await Entry.create({ emotions: ["happy", "sad", "glad"] });
  await User.create({
    name: "test",
    username: "tester",
    passwordHash: "supersecret",
  });
  await Habit.create({
    name: "some habit",
    progress: 0,
    isBinary: true,
    isArchived: false,
  });
})()
  .then((result) => {
    console.log("success");
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    mongoose.connection.close();
  });
