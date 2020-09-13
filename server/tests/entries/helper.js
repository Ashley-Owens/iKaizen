const Habit = require("../../models/habit");
const User = require("../../models/user");
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

const entryInDb = async (id) => {
  if (id) {
    return await Entry.findById(id);
  }

  return await Entry.findOne({ emotions: ["happy", "sad", "glad"] });
};

const deleteAll = async () => {
  await Habit.deleteMany({});
  await Entry.deleteMany({});
  await User.deleteMany({});
};

const entriesInDb = async () => {
  return await Entry.find({});
  // const entries = await Entry.find({});
  // return entries.map((entry) => entry.toJSON());
};

const getEntry = async (api, sessionId, entryId, statusCode) => {
  const request = api.get(`/api/entries/${entryId}`);

  if (sessionId) {
    request.set("Cookie", `connect.sid=${sessionId}`);
  }

  //request.expect(statusCode);

  return (await request).body;
};

const getEntriesByUser = async (api, sessionId, query, statusCode) => {
  const params = {};

  const paramList = ["year", "month", "day", "view"];
  for (let param of paramList) {
    if (query[param]) {
      params[param] = query[param];
    }
  }

  const request = api.get("/api/users/my/entries");

  if (sessionId) {
    request.set("Cookie", `connect.sid=${sessionId}`);
  }

  if (Object.keys(params).length > 0) {
    request.query(params);
  }

  request.expect(statusCode);

  const response = (await request).body;
  return response;
};

const editEntry = async (api, sessionId, entryId, entryEdit, statusCode) => {
  const request = api.put(`/api/entries/${entryId}`);

  if (sessionId) {
    request.set("Cookie", `connect.sid=${sessionId}`);
  }

  request.send(entryEdit).expect(statusCode);

  return (await request).body;
};

const deleteEntry = async (api, sessionId, entryId, statusCode) => {
  const request = api.delete(`/api/entries/${entryId}`);

  if (sessionId) {
    request.set("Cookie", `connect.sid=${sessionId}`);
  }

  request.expect(statusCode);

  return (await request).body;
};

module.exports = {
  insertInitialEntries,
  initialEntries,
  deleteAll,
  entriesInDb,
  nonExistentId,
  entryInDb,
  getEntry,
  getEntriesByUser,
  editEntry,
  deleteEntry,
};
