const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../../app");

const api = supertest(app);

const helper = require("./helper");
const usersHelper = require("../users/helper");

beforeEach(async () => {
  await helper.deleteAll();
  await helper.insertInitialHabits();
});

afterEach(async () => {
  await helper.deleteAll();
});

afterAll(async () => {
  await mongoose.connection.db.collection("sessions").deleteMany({});
  mongoose.connection.close();
});

const createUserHabit = async (sessionId, habit, isLongTerm, statusCode) => {
  const request = api.post("/api/users/my/habits");

  if (sessionId) request.set("Cookie", `connect.sid=${sessionId}`);
  if (isLongTerm && (isLongTerm === "true" || isLongTerm === "false")) {
    request.query({ isLongTerm });
  }

  //   request.send(habit).expect(statusCode);
  const response = await request.send(habit);
  console.log(response.body);

  //   return (await request).body;
  return response.body;
};

const createEntryHabit = async (sessionId, entryId, habit, statusCode) => {
  const request = api.post(`/api/entries/${entryId}/habits`);

  if (sessionId) request.set("Cookie", `connect.sid=${sessionId}`);
  request.send(habit).expect(statusCode);

  return (await request).body;
};

const checkHabitCount = async (increase) => {
  const habitsInDb = await helper.habitsInDb();
  const initialLength = helper.initialHabits().length;

  expect(habitsInDb).toHaveLength(initialLength + increase);
};

describe("creating habits", () => {
  test("works for long term habits at the user level", async () => {
    const user = usersHelper.user();
    const habit = { name: "my new habit", isBinary: false };
    const sessionId = await usersHelper.login(
      api,
      user.username,
      user.password
    );

    const newHabit = await createUserHabit(sessionId, habit, "true", 201);
    const userInDb = await usersHelper.userInDb();

    console.log(userInDb);

    const userLongTermHabits = userInDb.longTermHabits.map((habitId) =>
      habitId.toString()
    );

    expect(userLongTermHabits).toContain(newHabit.id);
    expect(newHabit.user.toString()).toBe(userInDb._id.toString());

    await checkHabitCount(1);
  });

  //   test("works for reoccurring habits at the user level", async () => {
  //     const user = helper.user();
  //     const habit = { name: "my new habit", isBinary: false };

  //     const sessionId = await helper.login(api, user.username, user.password);

  //     const newEntry = await createUserHabit(sessionId, habit, true, 201);
  //   });
});
