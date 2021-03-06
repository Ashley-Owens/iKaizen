const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../../app");

const api = supertest(app);
const helper = require("./helper");
const bcrypt = require("bcrypt");

beforeEach(async () => {
  await helper.deleteAll();
  await helper.insertInitialUsers();
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

const checkUserCount = async (newUser, shouldIncrease) => {
  const usersInDb = (await helper.usersInDb()).map((user) => user.toJSON());
  const initialLength = helper.users().length;

  if (shouldIncrease) {
    expect(usersInDb).toContainEqual(newUser);
    expect(usersInDb).toHaveLength(initialLength + 1);
  } else {
    if (newUser) {
      expect(usersInDb).not.toContainEqual(newUser);
    }
    expect(usersInDb).toHaveLength(initialLength);
  }
};

// describe("creating users", () => {
//   test("works correctly when the required properties are provided", async () => {
//     jest.setTimeout(10000);

//     const user = {
//       firstName: "first",
//       lastName: "last",
//       username: "myuser",
//       password: "mypassword",
//     };

//     const newUser = await helper.createUser(api, user, 201);

//     await checkUserCount(newUser, true);
//   });

//   test("fails with status code 400 when one of the required properties is missing", async () => {
//     // provide a user with no properties
//     let responseBody = await helper.createUser(api, {}, 400);
//     expect(responseBody.error).toBeDefined();

//     const user = {
//       firstName: "first",
//       lastName: "last",
//       username: "myuser",
//       password: "mypassword",
//     };
//     const properties = ["firstName", "lastName", "username", "password"];

//     // provide a user with one of the required properties missing
//     for (let property of properties) {
//       const userCopy = { ...user };
//       delete userCopy[property];

//       responseBody = await helper.createUser(api, userCopy, 400);
//       expect(responseBody.error).toBeDefined();
//     }
//   });

//   test("fails with status code 400 when the username is not unique", async () => {
//     const existingUser = helper.user();

//     responseBody = await helper.createUser(api, existingUser, 400);
//     expect(responseBody.error).toBeDefined();
//   });
// });

// describe("editing users", () => {
//   test("works when the request is valid and the user is logged in", async () => {
//     jest.setTimeout(30000);

//     const user = helper.user();
//     const sessionId = await helper.login(api, user.username, user.password);

//     const edits = {
//       firstName: "new first name",
//       lastName: "new last name",
//       email: "newemail@gmail.com",
//       appleId: "abcde",
//       password: "supersecretandsecurepassword",
//     };
//     const properties = Object.keys(edits);

//     // try to make every combination of edits
//     for (let i = 0; i < properties.length; i++) {
//       const editCombination = {};

//       for (let j = i; j < properties.length; j++) {
//         property = properties[j];
//         value = edits[property];
//         editCombination[property] = value;

//         await helper.editUser(api, sessionId, editCombination, 204);

//         const userInDb = await helper.userInDb();

//         for (let [editProperty, editValue] of Object.entries(editCombination)) {
//           if (editProperty === "password") {
//             const same = await bcrypt.compare(editValue, userInDb.passwordHash);
//             expect(same).toBe(true);
//           } else {
//             expect(userInDb[editProperty]).toBe(editValue);
//           }
//         }
//       }
//     }
//   });

//   test("fails with status code 400 if no required property is provided", async () => {
//     const invalidEdit = {
//       dateCreated: "today",
//       reoccurringHabits: "random value",
//       longTermHabits: "another value",
//     };

//     const user = helper.user();
//     const sessionId = await helper.login(api, user.username, user.password);

//     const responseBody = await helper.editUser(
//       api,
//       sessionId,
//       invalidEdit,
//       400
//     );
//     expect(responseBody.error).toBeDefined();
//   });

//   test("fails with status code 401 if the user is not logged in", async () => {
//     const userEdit = {
//       firstName: "new first name",
//       lastName: "new last name",
//       email: "newemail@gmail.com",
//       appleId: "abcde",
//       password: "newpassword",
//     };

//     const responseBody = await helper.editUser(api, null, userEdit, 401);
//     expect(responseBody.error).toBeDefined();
//   });
// });

// describe("user login", () => {
//   test("works when the user provides valid credentials", async () => {
//     const user = helper.user();
//     const sessionId = await helper.login(api, user.username, user.password);
//     expect(sessionId).toBeDefined();
//   });

//   test("fails with status code 401 if the user does not provide valid credentials", async () => {
//     await api
//       .post("/api/users/login")
//       .send({ username: "invalid", password: "superinvalid" })
//       .expect(401);
//   });

//   test("fails with status code 400 if either the 'username' or 'password' property is not provided", async () => {
//     await api.post("/api/users/login").send({ username: "user" }).expect(400);

//     await api
//       .post("/api/users/login")
//       .send({ password: "testuser" })
//       .expect(400);

//     await api.post("/api/users/login").expect(400);
//   });
// });

// describe("user logout", () => {
//   test("works when users are logged in", async () => {
//     jest.setTimeout(30000);

//     const users = helper.users();

//     for (let user of users) {
//       const sessionId = await helper.login(api, user.username, user.password);
//       let isLoggedIn = await helper.checkSession(api, sessionId);
//       expect(isLoggedIn).toBe(true);

//       await helper.logout(api, sessionId);
//       isLoggedIn = await helper.checkSession(api, sessionId);
//       expect(isLoggedIn).toBe(false);
//     }
//   });

//   test("works when users are not logged in", async () => {
//     // send a request to log out without sending a session id
//     await helper.logout(api);
//     let isLoggedIn = await helper.checkSession(api);
//     expect(isLoggedIn).toBe(false);

//     await helper.logout(api, "invalid");
//     isLoggedIn = await helper.checkSession(api, "invalid");
//     expect(isLoggedIn).toBe(false);
//   });
// });

describe("getting user info", () => {
  test("works", async () => {
    const user = helper.user();
    const sessionId = await helper.login(api, user.username, user.password);

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

    const request = api.get("/api/users/my/habits");
    request.set("Cookie", `connect.sid=${sessionId}`);
    request.expect(200);

    const response = await request;

    console.log(response.body);
  });
});
