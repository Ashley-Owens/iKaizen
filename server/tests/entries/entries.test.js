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
    // test("returns the current week's entries when 'view' is weekly", async () => {
    //   const user = usersHelper.user();
    //   const sessionId = await usersHelper.login(
    //     api,
    //     user.username,
    //     user.password
    //   );
    //   const query = { view: "weekly" };
    //   const expectedEntries = (await helper.entriesInDb()).filter((entry) => {
    //     const date = entry.date;
    //     const month = String(date.getMonth() + 1).padStart(2, "0");
    //     const year = String(date.getFullYear());
    //     return year == query.year && month == query.month;
    //   });
    //   const entries = await helper.getEntriesByUser(api, sessionId, query, 200);
    //   const byDate = (a, b) => a.date - b.date;
    //   expectedEntries.sort(byDate);
    //   entries.sort(byDate);
    //   expect(JSON.stringify(expectedEntries)).toEqual(JSON.stringify(entries));
    // });
    // test("returns the current month's entries when 'view' is monthly", async () => {});
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
});
