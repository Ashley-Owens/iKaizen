const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../../app");

const api = supertest(app);

const helper = require("./helper");
const usersHelper = require("../users/helper");
const entriesHelper = require("../entries/helper");
const Habit = require("../../models/habit");

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

  request.send(habit).expect(statusCode);

  return (await request).body;
};

const createEntryHabit = async (sessionId, entryId, habit, statusCode) => {
  const request = api.post(`/api/entries/${entryId}/habits`);

  if (sessionId) request.set("Cookie", `connect.sid=${sessionId}`);
  request.send(habit).expect(statusCode);

  return (await request).body;
};

const createEntry = async (sessionId, entry, statusCode) => {
  const request = api.post("/api/entries");

  if (sessionId) request.set("Cookie", `connect.sid=${sessionId}`);
  if (entry) request.send(entry);

  request.expect(statusCode);

  return (await request).body;
};

describe("creating habits", () => {
  describe("at the entry level", () => {
    test("creates a habit that has a reference to its entry and vice-versa", async () => {
      const user = usersHelper.user();
      const habit = { name: "my new habit", isBinary: false };
      const sessionId = await usersHelper.login(
        api,
        user.username,
        user.password
      );

      const entry = await createEntry(sessionId, null, 201);
      const newHabit = await createEntryHabit(sessionId, entry.id, habit, 201);
      expect(newHabit.error).not.toBeDefined();

      const updatedEntry = await entriesHelper.entryInDb(entry.id);
      const userInDb = await usersHelper.userInDb();

      expect(newHabit.entries.map((entryId) => entryId.toString())).toContain(
        entry.id
      );
      expect(
        updatedEntry.habitsSelected.map((habitId) => habitId.toString())
      ).toContain(newHabit.id);
      expect(
        userInDb.longTermHabits.map((habitId) => habitId.toString())
      ).not.toContain(newHabit.id);
    });

    test("fails with a 401 status code if the user is not logged in", async () => {
      const user = usersHelper.user();
      const habit = { name: "my new habit", isBinary: false };
      const sessionId = await usersHelper.login(
        api,
        user.username,
        user.password
      );

      const entry = await createEntry(sessionId, null, 201);
      const responseBody = await createEntryHabit(null, entry.id, habit, 401);

      expect(responseBody.error).toBeDefined();
    });

    test("fails with a 400 status code if the entry id is invalid", async () => {
      const user = usersHelper.user();
      const habit = { name: "my new habit", isBinary: false };
      const sessionId = await usersHelper.login(
        api,
        user.username,
        user.password
      );

      const responseBody = await createEntryHabit(
        sessionId,
        "invalid",
        habit,
        400
      );

      expect(responseBody.error).toBeDefined();
    });

    test("fails with a 404 status code when the specified entry is not found", async () => {
      const nonExistentId = await entriesHelper.nonExistentId();
      const user = usersHelper.user();
      const habit = { name: "my new habit", isBinary: false };
      const sessionId = await usersHelper.login(
        api,
        user.username,
        user.password
      );

      const responseBody = await createEntryHabit(
        sessionId,
        nonExistentId,
        habit,
        404
      );

      expect(responseBody.error).toBeDefined();
    });

    test("fails with a 401 status code when the user making the request does not own the entry", async () => {
      jest.setTimeout(30000);

      const authorizedUser = usersHelper.user();
      const authorizedUserSessionId = await usersHelper.login(
        api,
        authorizedUser.username,
        authorizedUser.password
      );

      const unauthorizedUser = {
        username: "testuser",
        password: "testpassword",
      };
      const unauthorizedUserSessionId = await usersHelper.login(
        api,
        unauthorizedUser.username,
        unauthorizedUser.password
      );

      const habit = { name: "my new habit", isBinary: false };
      const entry = await createEntry(authorizedUserSessionId, null, 201);

      const responseBody = await createEntryHabit(
        unauthorizedUserSessionId,
        entry.id,
        habit,
        401
      );

      expect(responseBody.error).toBeDefined();
    });

    test("fails with a 400 status code if either the 'name' or 'isBinary' properties are not provided", async () => {
      const user = usersHelper.user();
      const sessionId = await usersHelper.login(
        api,
        user.username,
        user.password
      );

      const entry = await createEntry(sessionId, null, 201);

      const invalidHabits = [
        { name: "my invalid habit" },
        { isBinary: true },
        { name: "my other invalid habit", isBinary: "not a boolean value" },
        { isBinary: "not a boolean value" },
      ];

      for (let invalidHabit of invalidHabits) {
        const responseBody = await createEntryHabit(
          sessionId,
          entry.id,
          invalidHabit,
          400
        );

        expect(responseBody.error).toBeDefined();
      }
    });
  });

  describe("at the user level", () => {
    test("works for long term habits", async () => {
      const user = usersHelper.user();
      const habit = { name: "my new habit", isBinary: false };
      const sessionId = await usersHelper.login(
        api,
        user.username,
        user.password
      );

      const newHabit = await createUserHabit(sessionId, habit, "true", 201);
      const userInDb = await usersHelper.userInDb();

      const userLongTermHabits = userInDb.longTermHabits.map((id) =>
        id.toString()
      );

      expect(userLongTermHabits).toContain(newHabit.id);
      expect(newHabit.user).toBe(userInDb._id.toString());
      expect(userInDb.get(habit.name)).not.toBeDefined();
    });

    test("works for reoccurring habits", async () => {
      const user = usersHelper.user();
      const habit = { name: "my new habit", isBinary: false };
      const sessionId = await usersHelper.login(
        api,
        user.username,
        user.password
      );

      const newHabit = await createUserHabit(sessionId, habit, "false", 201);
      const userInDb = await usersHelper.userInDb();

      const userLongTermHabits = userInDb.longTermHabits.map((id) =>
        id.toString()
      );

      expect(userInDb.reoccurringHabits.get(habit.name)).toBe(habit.isBinary);
      expect(userLongTermHabits).not.toContain(newHabit.id);
    });

    test("fails with a 400 status code if either the 'name' or 'isBinary' properties are not provided", async () => {
      const user = usersHelper.user();
      const sessionId = await usersHelper.login(
        api,
        user.username,
        user.password
      );

      let userInDb = await usersHelper.userInDb();
      const userLongTermHabits = userInDb.longTermHabits.map((id) =>
        id.toString()
      );
      const userReoccurringHabits = userInDb.reoccurringHabits;

      const responseBody = await createUserHabit(
        sessionId,
        { invalidProperty: "invalid" },
        "true",
        400
      );

      userInDb = await usersHelper.userInDb();
      const updatedUserLongTermHabits = userInDb.longTermHabits.map((id) =>
        id.toString()
      );
      const updatedUserReoccurringHabits = userInDb.reoccurringHabits;

      expect(userLongTermHabits).toEqual(updatedUserLongTermHabits);
      expect(userReoccurringHabits).toEqual(updatedUserReoccurringHabits);
      expect(responseBody.error).toBeDefined();
    });

    test("fails with a 400 status code if the 'isLongTerm' query parameter is not provided", async () => {
      const user = usersHelper.user();
      const habit = { name: "my new habit", isBinary: false };
      const sessionId = await usersHelper.login(
        api,
        user.username,
        user.password
      );

      let userInDb = await usersHelper.userInDb();
      const userLongTermHabits = userInDb.longTermHabits.map((id) =>
        id.toString()
      );
      const userReoccurringHabits = userInDb.reoccurringHabits;

      const responseBody = await createUserHabit(sessionId, habit, null, 400);

      userInDb = await usersHelper.userInDb();
      const updatedUserLongTermHabits = userInDb.longTermHabits.map((id) =>
        id.toString()
      );
      const updatedUserReoccurringHabits = userInDb.reoccurringHabits;

      expect(userLongTermHabits).toEqual(updatedUserLongTermHabits);
      expect(userReoccurringHabits).toEqual(updatedUserReoccurringHabits);
      expect(responseBody.error).toBeDefined();
    });

    test("fails with a 401 status code if the user is not logged in", async () => {
      const habit = { name: "my new habit", isBinary: false };
      const responseBody = await createUserHabit(null, habit, "true", 401);
      expect(responseBody.error).toBeDefined();
    });
  });
});

describe("editing habits", () => {
  test("works when the request is valid and the user is logged in", async () => {
    jest.setTimeout(30000);

    const user = usersHelper.user();
    const sessionId = await usersHelper.login(
      api,
      user.username,
      user.password
    );
    const habitInDb = await helper.habitInDb();

    const edits = {
      name: "this is a new habit name",
      isBinary: false,
      isArchived: true,
      progress: 80,
    };
    const properties = Object.keys(edits);

    // try to make every combination of edits
    for (let i = 0; i < properties.length; i++) {
      const editCombination = {};

      for (let j = i; j < properties.length; j++) {
        property = properties[j];
        value = edits[property];
        editCombination[property] = value;

        await helper.editHabit(
          api,
          sessionId,
          habitInDb._id,
          editCombination,
          204
        );

        const updatedHabitInDb = await helper.habitInDb();

        for (let [editProperty, editValue] of Object.entries(editCombination)) {
          expect(updatedHabitInDb[editProperty]).toBe(editValue);
        }
      }
    }
  });

  test("fails with status code 401 when the user is not logged in", async () => {
    const habitInDb = await helper.habitInDb();

    const edit = {
      name: "this is a new habit name",
      isBinary: false,
      isArchived: true,
      progress: 80,
    };

    await helper.editHabit(api, null, habitInDb._id, edit, 401);

    const updatedHabitInDb = await helper.habitInDb();
    expect(habitInDb).toEqual(updatedHabitInDb);
  });

  test("fails with status code 404 when the specified habit is not found", async () => {
    const nonExistentId = await helper.nonExistentId();
    const user = usersHelper.user();
    const sessionId = await usersHelper.login(
      api,
      user.username,
      user.password
    );

    const habitsInDb = await helper.habitsInDb();
    const edit = {
      name: "this is a new habit name",
      isBinary: false,
      isArchived: true,
      progress: 80,
    };

    await helper.editHabit(api, sessionId, nonExistentId, edit, 404);

    const updatedHabitsInDb = await helper.habitsInDb();
    expect(habitsInDb).toEqual(updatedHabitsInDb);
  });

  test("fails with status code 400 when the specified habit id is invalid", async () => {
    const invalidId = "abcde";
    const user = usersHelper.user();
    const sessionId = await usersHelper.login(
      api,
      user.username,
      user.password
    );

    const habitsInDb = await helper.habitsInDb();
    const edit = {
      name: "this is a new habit name",
      isBinary: false,
      isArchived: true,
      progress: 80,
    };

    await helper.editHabit(api, sessionId, invalidId, edit, 400);

    const updatedHabitsInDb = await helper.habitsInDb();
    expect(habitsInDb).toEqual(updatedHabitsInDb);
  });

  test("fails with status code 401 when the user making the request does not own the habit", async () => {
    const unauthorizedUser = { username: "testuser", password: "testpassword" };
    const sessionId = await usersHelper.login(
      api,
      unauthorizedUser.username,
      unauthorizedUser.password
    );

    const habitInDb = await helper.habitInDb();

    const edit = {
      name: "this is a new habit name",
      isBinary: false,
      isArchived: true,
      progress: 80,
    };

    await helper.editHabit(api, sessionId, habitInDb._id, edit, 401);

    const updatedHabitInDb = await helper.habitInDb();
    expect(habitInDb).toEqual(updatedHabitInDb);
  });

  test("succeeds with status code 204 but makes no changes when none of the valid properties are provided", async () => {
    const habitInDb = await helper.habitInDb();
    const user = usersHelper.user();
    const sessionId = await usersHelper.login(
      api,
      user.username,
      user.password
    );

    const edit = {
      invalidProperty: "invalid value",
    };

    await helper.editHabit(api, sessionId, habitInDb._id, edit, 204);

    const updatedHabitInDb = await helper.habitInDb();
    expect(habitInDb).toEqual(updatedHabitInDb);
  });
});

describe("deleting habits", () => {
  test("works when the request is valid and the user is logged in", async () => {
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

    // delete reoccurring habits
    for (let reoccurringHabitId of reoccurringHabitIds) {
      await helper.deleteHabit(api, sessionId, reoccurringHabitId, 204);
      expect(await Habit.findById(reoccurringHabitId)).toBeFalsy();

      // check that the entry no longer has references to the habit
      const updatedEntry = await entriesHelper.entryInDb(entry.id);
      expect(
        updatedEntry.habitsSelected.map((habitId) => habitId.toString())
      ).not.toContain(reoccurringHabitId);
    }

    // delete long term habits
    for (let longTermHabitId of longTermHabitIds) {
      await helper.deleteHabit(api, sessionId, longTermHabitId, 204);
      expect(await Habit.findById(longTermHabitId)).toBeFalsy();

      // check that the entry no longer has references to the habit
      const updatedEntry = await entriesHelper.entryInDb(entry.id);
      expect(
        updatedEntry.habitsSelected.map((habitId) => habitId.toString())
      ).not.toContain(longTermHabitId);

      // check that the user no longer has references to the habit
      const userInDb = await usersHelper.userInDb();
      expect(
        userInDb.longTermHabits.map((habitId) => habitId.toString())
      ).not.toContainEqual(longTermHabitId);
    }
  });

  test("fails with status code 401 when the user is not logged in", async () => {
    const habitInDb = await helper.habitInDb();
    const userInDb = await usersHelper.userInDb();

    await helper.deleteHabit(api, null, habitInDb._id, 401);

    const updatedHabitInDb = await helper.habitInDb();

    expect(habitInDb).toEqual(updatedHabitInDb);
    expect(userInDb.longTermHabits).toContainEqual(habitInDb._id);
  });

  test("fails with status code 404 when the specified habit is not found", async () => {
    const nonExistentId = await helper.nonExistentId();
    const user = usersHelper.user();
    const sessionId = await usersHelper.login(
      api,
      user.username,
      user.password
    );

    const habitInDb = await helper.habitInDb();
    const userInDb = await usersHelper.userInDb();

    await helper.deleteHabit(api, sessionId, nonExistentId, 404);

    const updatedHabitInDb = await helper.habitInDb();
    expect(habitInDb).toEqual(updatedHabitInDb);
    expect(userInDb.longTermHabits).toContainEqual(habitInDb._id);
  });
  test("fails with status code 400 when the specified habit id is invalid", async () => {
    const invalidId = "abcde";
    const user = usersHelper.user();
    const sessionId = await usersHelper.login(
      api,
      user.username,
      user.password
    );

    const habitInDb = await helper.habitInDb();
    const userInDb = await usersHelper.userInDb();

    await helper.deleteHabit(api, sessionId, invalidId, 400);

    const updatedHabitInDb = await helper.habitInDb();
    expect(habitInDb).toEqual(updatedHabitInDb);
    expect(userInDb.longTermHabits).toContainEqual(habitInDb._id);
  });
  test("fails with status code 401 when the user making the request does not own the habit", async () => {
    const unauthorizedUser = { username: "testuser", password: "testpassword" };
    const sessionId = await usersHelper.login(
      api,
      unauthorizedUser.username,
      unauthorizedUser.password
    );
    const habitInDb = await helper.habitInDb();
    const userInDb = await usersHelper.userInDb();

    await helper.deleteHabit(api, sessionId, habitInDb._id, 401);

    const updatedHabitInDb = await helper.habitInDb();
    expect(habitInDb).toEqual(updatedHabitInDb);
    expect(userInDb.longTermHabits).toContainEqual(habitInDb._id);
  });
});
