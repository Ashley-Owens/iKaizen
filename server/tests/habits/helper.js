const Habit = require("../../models/habit");
const Entry = require("../../models/entry");
const User = require("../../models/user");
const fakeHabits = require("./fakeHabits");
const usersHelper = require("../users/helper");

const initialHabits = () => {
  return fakeHabits.map((habit) => {
    return { ...habit };
  });
};

const initialCreatedHabits = () => {
  const habits = initialHabits();
  const longTermHabits = habits.filter((habit) => habit.isLongTerm);

  return longTermHabits;
};

const insertInitialHabits = async () => {
  await usersHelper.insertInitialUsers();

  const user = await usersHelper.userInDb();

  const habits = initialHabits();
  const reoccurringHabits = habits.filter((habit) => !habit.isLongTerm);
  const longTermHabits = habits.filter((habit) => habit.isLongTerm);

  reoccurringHabits.forEach((habit) =>
    user.reoccurringHabits.set(habit.name, habit.isBinary)
  );

  for (let habit of longTermHabits) {
    const habitObj = { ...habit };
    delete habitObj.isLongTerm;

    const newHabit = await Habit.create(habitObj);

    newHabit.user = user._id;
    user.longTermHabits.push(newHabit._id);
    await newHabit.save();
  }

  await user.save();
};

const nonExistentId = async () => {
  const habit = {
    name: "this will be deleted soon",
    isBinary: true,
  };

  const newHabit = await Habit.create(habit);
  const id = newHabit._id;
  await Habit.findByIdAndDelete(id);

  return id;
};

const deleteAll = async () => {
  await Habit.deleteMany({});
  await Entry.deleteMany({});
  await User.deleteMany({});
};

const habitsInDb = async () => {
  const habits = await Habit.find({});
  return habits.map((habit) => habit.toJSON());
};

const habitInDb = async (id) => {
  if (id) {
    return await Habit.findById(id);
  }

  const user = await usersHelper.userInDb();
  return await Habit.findOne({ user: user._id });
};

const editHabit = async (api, sessionId, habitId, habitEdit, statusCode) => {
  const request = api.put(`/api/habits/${habitId}`);

  if (sessionId) {
    request.set("Cookie", `connect.sid=${sessionId}`);
  }

  request.send(habitEdit).expect(statusCode);

  return (await request).body;
};

const deleteHabit = async (api, sessionId, habitId, statusCode) => {
  const request = api.delete(`/api/habits/${habitId}`);

  if (sessionId) {
    request.set("Cookie", `connect.sid=${sessionId}`);
  }

  request.expect(statusCode);

  return (await request).body;
};

module.exports = {
  insertInitialHabits,
  initialHabits,
  deleteAll,
  habitsInDb,
  nonExistentId,
  habitInDb,
  editHabit,
  deleteHabit,
  initialCreatedHabits,
};
