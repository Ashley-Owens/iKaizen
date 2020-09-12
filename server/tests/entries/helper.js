const Entry = require("../../models/entry");
const fakeEntries = require("./fakeEntries");
const usersHelper = require("../users/helper");

const initialEntries = () => {
  return fakeEntries.map((entry) => {
    return { ...entry, date: new Date(entry.date.getTime()) };
  });
};

const insertInitialEntries = async () => {
  await usersHelper.insertInitialUsers();

  const user = await usersHelper.userInDb();

  const entries = initialEntries();
  entries.forEach((entry) => (entry.user = user._id));

  const newEntries = await Entry.create(entries);
  newEntries.forEach((entry) => user.entries.push(entry._id));
};

const nonExistentId = async () => {
  const entry = {
    emotions: ["this", "will", "be", "deleted", "soon"],
  };

  const newEntry = await Entry.create(entry);
  const id = newEntry._id;
  await Entry.findByIdAndDelete(id);

  return id;
};

const entryInDb = async () => {
  return await Entry.findOne({ emotions: ["happy", "sad", "glad"] });
};

const deleteAll = async () => {
  await Entry.deleteMany({});
  await usersHelper.deleteAll();
};

const entriesInDb = async () => {
  const entries = await Entry.find({});
  return entries.map((entry) => entry.toJSON());
};

module.exports = {
  insertInitialEntries,
  initialEntries,
  deleteAll,
  entriesInDb,
  nonExistentId,
  entryInDb,
};
