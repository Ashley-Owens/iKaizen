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

  //   request.send(habit).expect(statusCode);
  const response = await request.send(habit).expect(statusCode);
  //   console.log(response.body);

  //   return (await request).body;
  return response.body;
};

const createEntryHabit = async (sessionId, entryId, habit, statusCode) => {
  const request = api.post(`/api/entries/${entryId}/habits`);

  if (sessionId) request.set("Cookie", `connect.sid=${sessionId}`);
  request.send(habit).expect(statusCode);

  return (await request).body;
};

// describe("creating habits", () => {
//     test("works for long term habits at the user level", async () => {
//       const user = usersHelper.user();
//       const habit = { name: "my new habit", isBinary: false };
//       const sessionId = await usersHelper.login(
//         api,
//         user.username,
//         user.password
//       );

//       const newHabit = await createUserHabit(sessionId, habit, "true", 201);
//       const userInDb = await usersHelper.userInDb();

//       const userLongTermHabits = userInDb.longTermHabits.map((id) =>
//         id.toString()
//       );

//       expect(userLongTermHabits).toContain(newHabit.id);
//       expect(newHabit.user).toBe(userInDb._id.toString());
//       expect(userInDb.get(habit.name)).not.toBeDefined();
//     });

//     test("works for reoccurring habits at the user level", async () => {
//       const user = usersHelper.user();
//       const habit = { name: "my new habit", isBinary: false };
//       const sessionId = await usersHelper.login(
//         api,
//         user.username,
//         user.password
//       );

//       const newHabit = await createUserHabit(sessionId, habit, "false", 201);
//       const userInDb = await usersHelper.userInDb();

//       const userLongTermHabits = userInDb.longTermHabits.map((id) =>
//         id.toString()
//       );

//       expect(userInDb.reoccurringHabits.get(habit.name)).toBe(habit.isBinary);
//       expect(userLongTermHabits).not.toContain(newHabit.id);
//     });

// //   test("works for one-off habits at the entry level", async () => {
// //   });

//     test("fails with a 400 status code if either the 'name' or 'isBinary' properties are not provided", async () => {
//       const user = usersHelper.user();
//       const sessionId = await usersHelper.login(
//         api,
//         user.username,
//         user.password
//       );

//       let userInDb = await usersHelper.userInDb();
//       const userLongTermHabits = userInDb.longTermHabits.map((id) =>
//         id.toString()
//       );
//       const userReoccurringHabits = userInDb.reoccurringHabits;

//       const responseBody = await createUserHabit(
//         sessionId,
//         { invalidProperty: "invalid" },
//         "true",
//         400
//       );

//       userInDb = await usersHelper.userInDb();
//       const updatedUserLongTermHabits = userInDb.longTermHabits.map((id) =>
//         id.toString()
//       );
//       const updatedUserReoccurringHabits = userInDb.reoccurringHabits;

//       expect(userLongTermHabits).toEqual(updatedUserLongTermHabits);
//       expect(userReoccurringHabits).toEqual(updatedUserReoccurringHabits);
//       expect(responseBody.error).toBeDefined();
//     });

//     test("fails with a 400 status code if the 'isLongTerm' query parameter is not provided", async () => {
//       const user = usersHelper.user();
//       const habit = { name: "my new habit", isBinary: false };
//       const sessionId = await usersHelper.login(
//         api,
//         user.username,
//         user.password
//       );

//       let userInDb = await usersHelper.userInDb();
//       const userLongTermHabits = userInDb.longTermHabits.map((id) =>
//         id.toString()
//       );
//       const userReoccurringHabits = userInDb.reoccurringHabits;

//       const responseBody = await createUserHabit(sessionId, habit, null, 400);

//       userInDb = await usersHelper.userInDb();
//       const updatedUserLongTermHabits = userInDb.longTermHabits.map((id) =>
//         id.toString()
//       );
//       const updatedUserReoccurringHabits = userInDb.reoccurringHabits;

//       expect(userLongTermHabits).toEqual(updatedUserLongTermHabits);
//       expect(userReoccurringHabits).toEqual(updatedUserReoccurringHabits);
//       expect(responseBody.error).toBeDefined();
//     });

//     test("fails with a 401 status code if the user is not logged in", async () => {
//       const habit = { name: "my new habit", isBinary: false };
//       const responseBody = await createUserHabit(null, habit, "true", 401);
//       expect(responseBody.error).toBeDefined();
//     });
// });

// describe("editing habits", () => {
//   test("works when the request is valid and the user is logged in", async () => {
//     const user = usersHelper.user();
//     const sessionId = await usersHelper.login(
//       api,
//       user.username,
//       user.password
//     );
//     const habitInDb = await helper.habitInDb();

//     const edits = {
//       name: "this is a new habit name",
//       isBinary: false,
//       isArchived: true,
//       progress: 80,
//     };
//     const properties = Object.keys(edits);

//     // try to make every combination of edits
//     for (let i = 0; i < properties.length; i++) {
//       const editCombination = {};

//       for (let j = i; j < properties.length; j++) {
//         property = properties[j];
//         value = edits[property];
//         editCombination[property] = value;

//         await helper.editHabit(
//           api,
//           sessionId,
//           habitInDb._id,
//           editCombination,
//           204
//         );

//         const updatedHabitInDb = await helper.habitInDb();

//         for (let [editProperty, editValue] of Object.entries(editCombination)) {
//           expect(updatedHabitInDb[editProperty]).toBe(editValue);
//         }
//       }
//     }
//   });

//   test("fails with status code 401 when the user is not logged in", async () => {
//     const habitInDb = await helper.habitInDb();

//     const edit = {
//       name: "this is a new habit name",
//       isBinary: false,
//       isArchived: true,
//       progress: 80,
//     };

//     await helper.editHabit(api, null, habitInDb._id, edit, 401);

//     const updatedHabitInDb = await helper.habitInDb();
//     expect(habitInDb).toEqual(updatedHabitInDb);
//   });

//   test("fails with status code 404 when the specified habit is not found", async () => {
//     const nonExistentId = await helper.nonExistentId();
//     const user = usersHelper.user();
//     const sessionId = await usersHelper.login(
//       api,
//       user.username,
//       user.password
//     );

//     const habitsInDb = await helper.habitsInDb();
//     const edit = {
//       name: "this is a new habit name",
//       isBinary: false,
//       isArchived: true,
//       progress: 80,
//     };

//     await helper.editHabit(api, sessionId, nonExistentId, edit, 404);

//     const updatedHabitsInDb = await helper.habitsInDb();
//     expect(habitsInDb).toEqual(updatedHabitsInDb);
//   });

//   test("fails with status code 400 when the specified habit id is invalid", async () => {
//     const invalidId = "abcde";
//     const user = usersHelper.user();
//     const sessionId = await usersHelper.login(
//       api,
//       user.username,
//       user.password
//     );

//     const habitsInDb = await helper.habitsInDb();
//     const edit = {
//       name: "this is a new habit name",
//       isBinary: false,
//       isArchived: true,
//       progress: 80,
//     };

//     await helper.editHabit(api, sessionId, invalidId, edit, 400);

//     const updatedHabitsInDb = await helper.habitsInDb();
//     expect(habitsInDb).toEqual(updatedHabitsInDb);
//   });

//   test("fails with status code 401 when the user making the request does not own the habit", async () => {
//     const unauthorizedUser = { username: "testuser", password: "testpassword" };
//     const sessionId = await usersHelper.login(
//       api,
//       unauthorizedUser.username,
//       unauthorizedUser.password
//     );

//     const habitInDb = await helper.habitInDb();

//     const edit = {
//       name: "this is a new habit name",
//       isBinary: false,
//       isArchived: true,
//       progress: 80,
//     };

//     await helper.editHabit(api, sessionId, habitInDb._id, edit, 401);

//     const updatedHabitInDb = await helper.habitInDb();
//     expect(habitInDb).toEqual(updatedHabitInDb);
//   });

//   test("succeeds with status code 204 but makes no changes when none of the valid properties are provided", async () => {
//     const habitInDb = await helper.habitInDb();
//     const user = usersHelper.user();
//     const sessionId = await usersHelper.login(
//       api,
//       user.username,
//       user.password
//     );

//     const edit = {
//       invalidProperty: "invalid value",
//     };

//     await helper.editHabit(api, sessionId, habitInDb._id, edit, 204);

//     const updatedHabitInDb = await helper.habitInDb();
//     expect(habitInDb).toEqual(updatedHabitInDb);
//   });
// });

describe("deleting habits", () => {
  test("works when the request is valid and the user is logged in", async () => {
    const user = usersHelper.user();
    const sessionId = await usersHelper.login(
      api,
      user.username,
      user.password
    );

    const habitInDb = await helper.habitInDb();
    const habitId = habitInDb._id;
    const userInDb = await usersHelper.userInDb();

    await helper.deleteHabit(api, sessionId, habitId, 204);

    expect(await Habit.findById(habitId)).toBeFalsy();
    expect(userInDb.longTermHabits).not.toContainEqual(habitId);
  });

  //   test("fails with status code 401 when the user is not logged in", async () => {
  //     const habitInDb = await helper.habitInDb();
  //     const userInDb = await usersHelper.userInDb();

  //     await helper.deleteHabit(api, null, habitInDb._id, 401);

  //     const updatedHabitInDb = await helper.habitInDb();
  //     expect(habitInDb).toEqual(updatedHabitInDb);
  //     expect(userInDb.longTermHabits).toContainEqual(habitInDb._id);
  //   });

  //   test("fails with status code 404 when the specified habit is not found", async () => {
  //     const nonExistentId = await helper.nonExistentId();
  //     const user = usersHelper.user();
  //     const sessionId = await usersHelper.login(
  //       api,
  //       user.username,
  //       user.password
  //     );

  //     const habitInDb = await helper.habitInDb();
  //     const userInDb = await usersHelper.userInDb();

  //     await helper.deleteHabit(api, sessionId, nonExistentId, 404);

  //     const updatedHabitInDb = await helper.habitInDb();
  //     expect(habitInDb).toEqual(updatedHabitInDb);
  //     expect(userInDb.longTermHabits).toContainEqual(habitInDb._id);
  //   });

  //   test("fails with status code 400 when the specified habit id is invalid", async () => {
  //     const invalidId = "abcde";
  //     const user = usersHelper.user();
  //     const sessionId = await usersHelper.login(
  //       api,
  //       user.username,
  //       user.password
  //     );

  //     const habitInDb = await helper.habitInDb();
  //     const userInDb = await usersHelper.userInDb();

  //     await helper.deleteHabit(api, sessionId, invalidId, 400);

  //     const updatedHabitInDb = await helper.habitInDb();
  //     expect(habitInDb).toEqual(updatedHabitInDb);
  //     expect(userInDb.longTermHabits).toContainEqual(habitInDb._id);
  //   });

  //   test("fails with status code 401 when the user making the request does not own the habit", async () => {
  //     const unauthorizedUser = { username: "testuser", password: "testpassword" };
  //     const sessionId = await usersHelper.login(
  //       api,
  //       unauthorizedUser.username,
  //       unauthorizedUser.password
  //     );

  //     const habitInDb = await helper.habitInDb();
  //     const userInDb = await usersHelper.userInDb();

  //     await helper.deleteHabit(api, sessionId, habitInDb._id, 401);

  //     const updatedHabitInDb = await helper.habitInDb();
  //     expect(habitInDb).toEqual(updatedHabitInDb);
  //     expect(userInDb.longTermHabits).toContainEqual(habitInDb._id);
  //   });
});

// const userLongTermHabits = userInDb.longTermHabits.map((id) =>
// id.toString()
// );
// const userReoccurringHabits = userInDb.reoccurringHabits;

// const responseBody = await createUserHabit(
// sessionId,
// { invalidProperty: "invalid" },
// "true",
// 400
// );
