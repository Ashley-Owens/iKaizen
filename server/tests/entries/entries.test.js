const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../../app");

const api = supertest(app);

const helper = require("./helper");
const usersHelper = require("../users/helper");

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

const createEntry = async (sessionId, statusCode) => {
  const request = api.post("/api/entries");

  if (sessionId) request.set("Cookie", `connect.sid=${sessionId}`);
  request.expect(statusCode);

  return (await request).body;
};

const checkEntryCount = async (increase) => {
  const entriesInDb = await helper.entriesInDb();
  const initialLength = helper.initialEntries().length;

  expect(entriesInDb).toHaveLength(initialLength + increase);
};

// describe("retrieving entries by id", () => {
//   test("works when the request is valid and the user is logged in", async () => {
//     const user = usersHelper.user();
//     const entryInDb = await helper.entryInDb();
//     const sessionId = await usersHelper.login(
//       api,
//       user.username,
//       user.password
//     );

//     const retrievedEntry = await helper.getEntry(
//       api,
//       sessionId,
//       entryInDb._id,
//       200
//     );

//     expect(JSON.stringify(entryInDb)).toEqual(JSON.stringify(retrievedEntry));
//   });

//   test("fails with a 401 status code when the user is not logged in", async () => {
//     const entryInDb = await helper.entryInDb();

//     const responseBody = await helper.getEntry(api, null, entryInDb._id, 401);
//     expect(responseBody.error).toBeDefined();
//   });

//   test("fails with a 400 status code when the entry id is invalid", async () => {
//     const invalidId = "abcde";
//     const user = usersHelper.user();
//     const sessionId = await usersHelper.login(
//       api,
//       user.username,
//       user.password
//     );

//     const responseBody = await helper.getEntry(api, sessionId, invalidId, 400);
//     expect(responseBody.error).toBeDefined();
//   });

//   test("fails with a 404 status code when the specified entry is not found", async () => {
//     const nonExistentId = await helper.nonExistentId();
//     const user = usersHelper.user();
//     const sessionId = await usersHelper.login(
//       api,
//       user.username,
//       user.password
//     );

//     const responseBody = await helper.getEntry(
//       api,
//       sessionId,
//       nonExistentId,
//       404
//     );
//     expect(responseBody.error).toBeDefined();
//   });

//   test("fails with a 401 status code when the user making the request does not own the entry", async () => {
//     const unauthorizedUser = { username: "testuser", password: "testpassword" };
//     const sessionId = await usersHelper.login(
//       api,
//       unauthorizedUser.username,
//       unauthorizedUser.password
//     );

//     const entryInDb = await helper.entryInDb();

//     const responseBody = await helper.getEntry(
//       api,
//       sessionId,
//       entryInDb._id,
//       401
//     );
//     expect(responseBody.error).toBeDefined();
//   });
// });

describe("retrieving entries for a logged in user", () => {
  //   test("fails with a 401 status code when the user is not logged in", async () => {
  //     const responseBody = await helper.getEntriesByUser(api, null, {}, 401);
  //     expect(responseBody.error).toBeDefined();
  //   });

  //   test("fails with a 400 status code when no query string is provided", async () => {
  //     const user = usersHelper.user();
  //     const sessionId = await usersHelper.login(
  //       api,
  //       user.username,
  //       user.password
  //     );

  //     const responseBody = await helper.getEntriesByUser(api, sessionId, {}, 400);
  //     expect(responseBody.error).toBeDefined();
  //   });

  // test("fails with a 400 status code when no query string is provided", async () => {
  //     const user = usersHelper.user();
  //     const sessionId = await usersHelper.login(
  //       api,
  //       user.username,
  //       user.password
  //     );

  //     const responseBody = await helper.getEntriesByUser(api, sessionId, {}, 400);
  //     expect(responseBody.error).toBeDefined();
  //   });

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
      { year: "2020" },
      400
    );
    expect(responseBody.error).toBeDefined();
    responseBody = await helper.getEntriesByUser(
      api,
      sessionId,
      { year: "2020", day: "10" },
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
});
