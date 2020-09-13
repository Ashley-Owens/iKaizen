const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../../app");

const api = supertest(app);

const helper = require("./helper");
const usersHelper = require("../users/helper");
const habitsHelper = require("../habits/helper");
const getWeekday = require("../../utils/getWeekday");
const formatDate = require("../../utils/formatDate");


beforeEach(async () => {
  await helper.deleteAll();
  await helper.insertInitialEntries();
});

afterEach(async () => {
  await helper.deleteAll();
});

afterAll(async () => {
  await mongoose.connection.db.collection("sessions").deleteMany({});
  mongoose.connection.close();
});

const createEntry = async (sessionId, entry, statusCode) => {
  const request = api.post("/api/entries");

  if (sessionId) request.set("Cookie", `connect.sid=${sessionId}`);
  if (entry) request.send(entry);

  request.expect(statusCode);

  return (await request).body;
};

const checkEntryCount = async (increase) => {
  const entriesInDb = await helper.entriesInDb();
  const initialLength = helper.initialEntries().length;

  expect(entriesInDb).toHaveLength(initialLength + increase);
};

const createUserHabit = async (sessionId, habit, isLongTerm, statusCode) => {
  const request = api.post("/api/users/my/habits");

  if (sessionId) request.set("Cookie", `connect.sid=${sessionId}`);
  if (isLongTerm && (isLongTerm === "true" || isLongTerm === "false")) {
    request.query({ isLongTerm });
  }

  request.send(habit).expect(statusCode);

  return (await request).body;
};

describe("retrieving entries by id", () => {
  test("works when the request is valid and the user is logged in", async () => {
    const user = usersHelper.user();
    const entryInDb = await helper.entryInDb();
    const sessionId = await usersHelper.login(
      api,
      user.username,
      user.password
    );

    const retrievedEntry = await helper.getEntry(
      api,
      sessionId,
      entryInDb._id,
      200
    );
    expect(JSON.stringify(entryInDb)).toEqual(JSON.stringify(retrievedEntry));
  });

  test("fails with a 401 status code when the user is not logged in", async () => {
    const entryInDb = await helper.entryInDb();

    const responseBody = await helper.getEntry(api, null, entryInDb._id, 401);
    expect(responseBody.error).toBeDefined();
  });

  test("fails with a 400 status code when the entry id is invalid", async () => {
    const invalidId = "abcde";
    const user = usersHelper.user();
    const sessionId = await usersHelper.login(
      api,
      user.username,
      user.password
    );

    const responseBody = await helper.getEntry(api, sessionId, invalidId, 400);
    expect(responseBody.error).toBeDefined();
  });

  test("fails with a 404 status code when the specified entry is not found", async () => {
    const nonExistentId = await helper.nonExistentId();
    const user = usersHelper.user();
    const sessionId = await usersHelper.login(
      api,
      user.username,
      user.password
    );

    const responseBody = await helper.getEntry(
      api,
      sessionId,
      nonExistentId,
      404
    );
    expect(responseBody.error).toBeDefined();
  });

  test("fails with a 401 status code when the user making the request does not own the entry", async () => {
    const unauthorizedUser = { username: "testuser", password: "testpassword" };
    const sessionId = await usersHelper.login(
      api,
      unauthorizedUser.username,
      unauthorizedUser.password
    );

    const entryInDb = await helper.entryInDb();

    const responseBody = await helper.getEntry(
      api,
      sessionId,
      entryInDb._id,
      401
    );
    expect(responseBody.error).toBeDefined();
  });
});

describe("retrieving entries for a logged in user", () => {
  describe("with the 'view' parameter", () => {
    test("returns the current week's entries when 'view' is weekly", async () => {
      const user = usersHelper.user();
      const sessionId = await usersHelper.login(
        api,
        user.username,
        user.password
      );
      const query = { view: "weekly" };
      const expectedEntries = (await helper.entriesInDb()).filter((entry) => {
        const firstDayOfCurrentWeek = getWeekday({ day: 0, atMidnight: true });
        const firstDayOfNextWeek = getWeekday({ day: 7, atMidnight: true });

        return (
          entry.date >= firstDayOfCurrentWeek && entry.date < firstDayOfNextWeek
        );
      });

      const entries = await helper.getEntriesByUser(api, sessionId, query, 200);

      const byDate = (a, b) => a.date - b.date;
      expectedEntries.sort(byDate);
      entries.sort(byDate);

      expect(JSON.stringify(expectedEntries)).toEqual(JSON.stringify(entries));
    });

    test("returns the current month's entries up to the current day when 'view' is monthly", async () => {
      const user = usersHelper.user();
      const sessionId = await usersHelper.login(
        api,
        user.username,
        user.password
      );
      const query = { view: "monthly" };

      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      firstDayOfMonth.setHours(0, 0, 0, 0);

      const tomorrow = new Date();
      tomorrow.setDate(new Date().getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const expectedEntries = (await helper.entriesInDb()).filter((entry) => {
        return entry.date >= firstDayOfMonth && entry.date < tomorrow;
      });

      const entries = await helper.getEntriesByUser(api, sessionId, query, 200);

      const byDate = (a, b) => a.date - b.date;
      expectedEntries.sort(byDate);
      entries.sort(byDate);

      expect(JSON.stringify(expectedEntries)).toEqual(JSON.stringify(entries));
    });
  });

  describe("without the 'view' parameter", () => {
    test("returns the current month when a valid year and month are provided (but no day) ", async () => {
      const user = usersHelper.user();
      const sessionId = await usersHelper.login(
        api,
        user.username,
        user.password
      );

      const query = { year: "2019", month: "10" };
      const expectedEntries = (await helper.entriesInDb()).filter((entry) => {
        const date = entry.date;
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = String(date.getFullYear());

        return year == query.year && month == query.month;
      });

      const entries = await helper.getEntriesByUser(api, sessionId, query, 200);

      const byDate = (a, b) => a.date - b.date;
      expectedEntries.sort(byDate);
      entries.sort(byDate);

      expect(JSON.stringify(expectedEntries)).toEqual(JSON.stringify(entries));
    });

    test("returns the current date's entry when a valid 'year', 'month', and 'day' parameters are provided", async () => {
      const user = usersHelper.user();
      const sessionId = await usersHelper.login(
        api,
        user.username,
        user.password
      );

      const query = { year: "2019", month: "10", day: "31" };
      const expectedEntry = (await helper.entriesInDb()).find((entry) => {
        const date = entry.date;
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = String(date.getFullYear());
        const day = String(date.getDate()).padStart(2, "0");

        return (
          year === query.year && month === query.month && day === query.day
        );
      });

      const entry = await helper.getEntriesByUser(api, sessionId, query, 200);

      expect(JSON.stringify(expectedEntry)).toEqual(JSON.stringify(entry));
    });

    test("fails with a 400 status code when an invalid query string is provided", async () => {
      const user = usersHelper.user();
      const sessionId = await usersHelper.login(
        api,
        user.username,
        user.password
      );

      // send an empty query string
      let responseBody = await helper.getEntriesByUser(api, sessionId, {}, 400);
      expect(responseBody.error).toBeDefined();

      // query by year without a month
      responseBody = await helper.getEntriesByUser(
        api,
        sessionId,
        { year: "2019" },
        400
      );
      expect(responseBody.error).toBeDefined();
      responseBody = await helper.getEntriesByUser(
        api,
        sessionId,
        { year: "2019", day: "10" },
        400
      );
      expect(responseBody.error).toBeDefined();

      // query by month without a year
      responseBody = await helper.getEntriesByUser(
        api,
        sessionId,
        { month: "08" },
        400
      );
      expect(responseBody.error).toBeDefined();
      responseBody = await helper.getEntriesByUser(
        api,
        sessionId,
        { month: "08", day: "10" },
        400
      );
      expect(responseBody.error).toBeDefined();

      // query by just a day
      responseBody = await helper.getEntriesByUser(
        api,
        sessionId,
        { day: "10" },
        400
      );
      expect(responseBody.error).toBeDefined();
    });

    test("fails with a 400 status code when 'year' and 'month' are provided but either one is malformed", async () => {
      const user = usersHelper.user();
      const sessionId = await usersHelper.login(
        api,
        user.username,
        user.password
      );

      // query with valid year and invalid month
      let responseBody = await helper.getEntriesByUser(
        api,
        sessionId,
        { year: "2019", month: "abc" },
        400
      );
      expect(responseBody.error).toBeDefined();

      // query with invalid year and valid month
      responseBody = await helper.getEntriesByUser(
        api,
        sessionId,
        { year: "abc", month: "2019" },
        400
      );
      expect(responseBody.error).toBeDefined();
    });

    test("fails with a 400 status code when 'year', 'month', and 'day' are provided but at least one is malformed", async () => {
      const user = usersHelper.user();
      const sessionId = await usersHelper.login(
        api,
        user.username,
        user.password
      );

      const queries = [
        { year: "-2019", month: "10", day: "01" },
        { year: "2019", month: "13", day: "01" },
        { year: "2019", month: "10", day: "32" },
      ];

      for (const query of queries) {
        const responseBody = await helper.getEntriesByUser(
          api,
          sessionId,
          query,
          400
        );

        expect(responseBody.error).toBeDefined();
      }
    });

    test("fails with a 404 status code when 'year' and 'month' (but not 'day') are provided but there are no entries for that month", async () => {
      const user = usersHelper.user();
      const sessionId = await usersHelper.login(
        api,
        user.username,
        user.password
      );

      responseBody = await helper.getEntriesByUser(
        api,
        sessionId,
        { year: "1999", month: "02" },
        404
      );

      expect(responseBody.error).toBeDefined();
    });

    test("fails with a 404 status code when 'year', 'month', and 'day' are provided but there is no entry for that date", async () => {
      const user = usersHelper.user();
      const sessionId = await usersHelper.login(
        api,
        user.username,
        user.password
      );

      responseBody = await helper.getEntriesByUser(
        api,
        sessionId,
        { year: "1999", month: "02", day: "03" },
        404
      );
      expect(responseBody.error).toBeDefined();
    });
  });

  test("fails with a 401 status code when the user is not logged in", async () => {
    const responseBody = await helper.getEntriesByUser(api, null, {}, 401);
    expect(responseBody.error).toBeDefined();
  });

  test("fails with a 400 status code when no query string is provided", async () => {
    const user = usersHelper.user();
    const sessionId = await usersHelper.login(
      api,
      user.username,
      user.password
    );

    const responseBody = await helper.getEntriesByUser(api, sessionId, {}, 400);
    expect(responseBody.error).toBeDefined();
  });
});

describe("creating entries", () => {
  test("inserts an entry corresponding to the current date if no date is specified", async () => {
    const user = usersHelper.user();
    const sessionId = await usersHelper.login(
      api,
      user.username,
      user.password
    );

    const entry = await createEntry(sessionId, null, 201);

    const today = formatDate(new Date());

    expect(entry.date.year).toBe(today.year);
    expect(entry.date.month).toBe(today.month);
    expect(entry.date.day).toBe(today.day);

    await checkEntryCount(1);
  });

  test("inserts an entry corresponding to the specified date if one is specified", async () => {
    const user = usersHelper.user();
    const sessionId = await usersHelper.login(
      api,
      user.username,
      user.password
    );

    let date = new Date(2020, 7, 20);
    const entry = await createEntry(sessionId, { date: date.toJSON() }, 201);

    date = formatDate(date);

    expect(entry.date.year).toBe(date.year);
    expect(entry.date.month).toBe(date.month);
    expect(entry.date.day).toBe(date.day);

    await checkEntryCount(1);
  });

  test("fails with a 401 status code if the user is not logged in", async () => {
    const responseBody = await createEntry(null, null, 401);
    expect(responseBody.error).toBeDefined();

    await checkEntryCount(0);
  });

  test("fails with a 400 status code if the specified date is invalid", async () => {
    const user = usersHelper.user();
    const sessionId = await usersHelper.login(
      api,
      user.username,
      user.password
    );

    const responseBody = await createEntry(sessionId, { date: "abcde" }, 400);
    expect(responseBody.error).toBeDefined();

    await checkEntryCount(0);
  });

  test("correctly adds references between users, entries, and habits", async () => {
    jest.setTimeout(30000);

    const user = usersHelper.user();
    const sessionId = await usersHelper.login(
      api,
      user.username,
      user.password
    );

    // add both reoccurring habits and long term habits to the user
    const habits = {
      reoccurring: [
        { name: "run a mile every day", isBinary: true },
        { name: "test my code every day", isBinary: true },
        { name: "blah blah blah", isBinary: false },
      ],
      longTerm: [
        { name: "run 10 miles every day", isBinary: true },
        { name: "test my code twice a day", isBinary: true },
        { name: "blah blah blah blah blah", isBinary: false },
      ],
    };

    for (let habit of habits.reoccurring) {
      await createUserHabit(sessionId, habit, "false", 201);
    }

    for (let habit of habits.longTerm) {
      await createUserHabit(sessionId, habit, "true", 201);
    }

    // create the entry
    const date = new Date(2020, 7, 20);
    const entry = await createEntry(sessionId, { date: date.toJSON() }, 201);
    const updatedUserInDb = await usersHelper.userInDb();

    // check that the user has a reference to the entry
    const userEntryIds = updatedUserInDb.entries.map((entryId) =>
      entryId.toString()
    );
    expect(userEntryIds).toContain(entry.id);

    // check that the entry has a reference to the user
    expect(entry.user).toBe(updatedUserInDb._id.toString());

    // check that the entry created the reoccurring habits and that each habit has references to both the entry and the user
    for (let habit of habits.reoccurring) {
      const entryHabit = entry.habitsSelected.find(
        (habitObj) => habitObj.name === habit.name
      );

      expect(entryHabit.name).toBe(habit.name);
      expect(entryHabit.user).toBe(updatedUserInDb._id.toString());
      expect(entryHabit.entries).toContain(entry.id);
    }

    // check that the entry added in the long term habits and that the habit objects are not new
    const longTermHabits = updatedUserInDb.longTermHabits;

    for (let habit of longTermHabits) {
      const entryHabit = entry.habitsSelected.find(
        (habitObj) => habitObj.id === habit._id.toString()
      );

      expect(entryHabit.id).toBe(habit._id.toString());
      expect(entryHabit.user).toBe(updatedUserInDb._id.toString());
      expect(entryHabit.entries).toContain(entry.id);
      expect(habits.longTerm).toContainEqual({
        name: entryHabit.name,
        isBinary: entryHabit.isBinary,
      });
    }
  });
});

describe("editing entries", () => {
  test("fails with a 401 status code if the user is not logged in", async () => {
    const entryInDb = await helper.entryInDb();

    const responseBody = await helper.editEntry(
      api,
      null,
      entryInDb._id,
      { emotions: ["new emotion"] },
      401
    );
    expect(responseBody.error).toBeDefined();
  });

  test("fails with a 400 status code if the entry id is invalid", async () => {
    const user = usersHelper.user();
    const sessionId = await usersHelper.login(
      api,
      user.username,
      user.password
    );

    const responseBody = await helper.editEntry(
      api,
      sessionId,
      "invalid",
      { emotions: ["new emotion"] },
      400
    );
    expect(responseBody.error).toBeDefined();
  });

  test("fails with a 404 status code if the entry id is valid but no such entry exists", async () => {
    const nonExistentId = await helper.nonExistentId();
    const user = usersHelper.user();
    const sessionId = await usersHelper.login(
      api,
      user.username,
      user.password
    );

    const responseBody = await helper.editEntry(
      api,
      sessionId,
      nonExistentId,
      { emotions: ["new emotion"] },
      404
    );
    expect(responseBody.error).toBeDefined();
  });

  test("fails with a 401 status code if the user making the request does not own the entry", async () => {
    const entryInDb = await helper.entryInDb();
    const unauthorizedUser = { username: "testuser", password: "testpassword" };
    const sessionId = await usersHelper.login(
      api,
      unauthorizedUser.username,
      unauthorizedUser.password
    );

    const responseBody = await helper.editEntry(
      api,
      sessionId,
      entryInDb._id,
      { emotions: ["new emotion"] },
      401
    );
    expect(responseBody.error).toBeDefined();
  });

  test("fails with a 400 status code if the 'emotions' property is not provided", async () => {
    const entryInDb = await helper.entryInDb();
    const user = usersHelper.user();
    const sessionId = await usersHelper.login(
      api,
      user.username,
      user.password
    );

    const responseBody = await helper.editEntry(
      api,
      sessionId,
      entryInDb._id,
      {
        emotionsssss: [
          "happy",
          "sad",
          "new emotion",
          "another emotion",
          "a third emotion",
        ],
      },
      400
    );
    expect(responseBody.error).toBeDefined();
  });

  test("fails with a 400 status code if the 'emotions' property is not provided", async () => {
    const entryInDb = await helper.entryInDb();
    const user = usersHelper.user();
    const sessionId = await usersHelper.login(
      api,
      user.username,
      user.password
    );

    const responseBody = await helper.editEntry(
      api,
      sessionId,
      entryInDb._id,
      {
        emotionsssss: [
          "happy",
          "sad",
          "new emotion",
          "another emotion",
          "a third emotion",
        ],
      },
      400
    );
    expect(responseBody.error).toBeDefined();
  });

  test("fails with a 400 status code if the 'emotions' property is provided but is not valid", async () => {
    const entryInDb = await helper.entryInDb();
    const user = usersHelper.user();
    const sessionId = await usersHelper.login(
      api,
      user.username,
      user.password
    );

    const invalidEmotionBodies = [
      "has to be an array",
      { this: "is not an array" },
      12345,
      ["happy", "sad", "this is not a valid emotion"],
    ];

    for (const invalidEmotionBody of invalidEmotionBodies) {
      const responseBody = await helper.editEntry(
        api,
        sessionId,
        entryInDb._id,
        {
          emotions: invalidEmotionBody,
        },
        400
      );
      expect(responseBody.error).toBeDefined();
    }
  });

  test("works when the 'emotions' property is valid", async () => {
    const entryInDb = await helper.entryInDb();
    const user = usersHelper.user();
    const sessionId = await usersHelper.login(
      api,
      user.username,
      user.password
    );

    const emotions = ["Excitement", "Happy", "Joyful"];

    const responseBody = await helper.editEntry(
      api,
      sessionId,
      entryInDb._id,
      { emotions },
      204
    );
    expect(responseBody.error).not.toBeDefined();

    const updatedEntryInDb = await helper.entryInDb(entryInDb._id);
    expect(Array.from(updatedEntryInDb.emotions)).toEqual(emotions);
  });
});

describe("deleting entries", () => {
  test("fails with a 401 status code if the user is not logged in", async () => {
    const entryInDb = await helper.entryInDb();

    const responseBody = await helper.deleteEntry(
      api,
      null,
      entryInDb._id,
      401
    );
    expect(responseBody.error).toBeDefined();
  });

  test("fails with a 400 status code if the entry id is invalid", async () => {
    const user = usersHelper.user();
    const sessionId = await usersHelper.login(
      api,
      user.username,
      user.password
    );

    const responseBody = await helper.deleteEntry(
      api,
      sessionId,
      "invalid",
      400
    );
    expect(responseBody.error).toBeDefined();
  });

  test("fails with a 404 status code if the entry id is valid but no such entry exists", async () => {
    const nonExistentId = await helper.nonExistentId();
    const user = usersHelper.user();
    const sessionId = await usersHelper.login(
      api,
      user.username,
      user.password
    );

    const responseBody = await helper.deleteEntry(
      api,
      sessionId,
      nonExistentId,
      404
    );
    expect(responseBody.error).toBeDefined();
  });

  test("fails with a 401 status code if the user making the request does not own the entry", async () => {
    const entryInDb = await helper.entryInDb();
    const unauthorizedUser = { username: "testuser", password: "testpassword" };
    const sessionId = await usersHelper.login(
      api,
      unauthorizedUser.username,
      unauthorizedUser.password
    );

    const responseBody = await helper.deleteEntry(
      api,
      sessionId,
      entryInDb._id,
      401
    );
    expect(responseBody.error).toBeDefined();
  });

  test("removes the entry from the database as well as associated references in User and Habit objects", async () => {
    jest.setTimeout(30000);

    const user = usersHelper.user();
    const sessionId = await usersHelper.login(
      api,
      user.username,
      user.password
    );

    // add both reoccurring habits and long term habits to the user
    const habits = {
      reoccurring: [
        { name: "run a mile every day", isBinary: true },
        { name: "test my code every day", isBinary: true },
        { name: "blah blah blah", isBinary: false },
      ],
      longTerm: [
        { name: "run 10 miles every day", isBinary: true },
        { name: "test my code twice a day", isBinary: true },
        { name: "blah blah blah blah blah", isBinary: false },
      ],
    };

    for (let habit of habits.reoccurring) {
      await createUserHabit(sessionId, habit, "false", 201);
    }

    for (let habit of habits.longTerm) {
      await createUserHabit(sessionId, habit, "true", 201);
    }

    // save the ids of the habits belonging to the entry
    const entry = await createEntry(sessionId, null, 201);

    const reoccurringHabitNames = habits.reoccurring.map((habit) => habit.name);
    const longTermHabitNames = habits.longTerm.map((habit) => habit.name);

    const reoccurringHabitIds = entry.habitsSelected
      .filter((habit) => reoccurringHabitNames.includes(habit.name))
      .map((habit) => habit.id);
    const longTermHabitIds = entry.habitsSelected
      .filter((habit) => longTermHabitNames.includes(habit.name))
      .map((habit) => habit.id);

    // delete the entry
    const responseBody = await helper.deleteEntry(
      api,
      sessionId,
      entry.id,
      204
    );
    expect(responseBody.error).not.toBeDefined();

    // check that the entry is deleted from the database
    // entry count shouldn't change from the initial state since we created then deleted an entry
    await checkEntryCount(0);
    const entryInDb = await helper.entryInDb(entry.id);
    expect(entryInDb).toBeFalsy();

    // check that the user no longer has a reference to the deleted entry
    const updatedUserInDb = await usersHelper.userInDb();
    const updatedUserEntryIds = updatedUserInDb.entries.map((entryId) =>
      entryId.toString()
    );
    expect(updatedUserEntryIds).not.toContain(entry.id);

    // check that the reocurring habits that belong to the entry are deleted
    for (const reoccuringHabitId of reoccurringHabitIds) {
      const habitInDb = await habitsHelper.habitInDb(reoccuringHabitId);
      expect(habitInDb).toBeFalsy();
    }

    // check that the long term habits that belong to the entry remove its reference from their reference array
    for (const longTermHabitId of longTermHabitIds) {
      const habitInDb = await habitsHelper.habitInDb(longTermHabitId);

      expect(
        habitInDb.entries.map((entryId) => entryId.toString())
      ).not.toContain(entry.id);
    }
  });
});
