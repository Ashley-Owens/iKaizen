const User = require("../../models/user");
const {
  initialUsers,
  initialUsersWithHashedPasswords,
} = require("./fakeUsers");

const insertInitialUsers = async () => {
  await User.create(initialUsersWithHashedPasswords);
};

const users = () => {
  return initialUsers.map((user) => {
    return { ...user };
  });
};

const usersWithHashedPasswords = () => {
  return initialUsersWithHashedPasswords.map((user) => {
    return { ...user };
  });
};

const nonExistentId = async () => {
  const user = {
    firstName: "hello",
    lastName: "world",
    username: "willsoon",
    passwordHash: "notexist",
  };
  const newUser = await User.create(user);

  const id = newUser._id;

  await User.findByIdAndDelete(id);

  return id;
};

const user = () => {
  return { ...initialUsers[0] };
};

const userInDb = async () => {
  return await User.findOne({ username: "user" });
};

const usersInDb = async () => {
  return await User.find({});
};

const deleteAll = async () => {
  await User.deleteMany({});
};

const parseCookie = (cookie) => {
  const parsedCookie = {};
  cookie = cookie.split(";").map((prop) => prop.split("="));

  for (let [key, val] of cookie) {
    key = key.trim();
    val = val ? val.trim() : true;

    parsedCookie[key] = val;
  }

  return parsedCookie;
};

const login = async (api, username, password) => {
  const response = await api
    .post("/api/users/login")
    .send({ username, password })
    .expect(200);

  const sessionId = parseCookie(response.header["set-cookie"][0])[
    "connect.sid"
  ];

  return sessionId;
};

const logout = async (api, sessionId) => {
  const request = api.post("/api/users/logout");

  if (sessionId) {
    request.set("Cookie", `connect.sid=${sessionId}`);
  }

  await request.expect(200);
};

const createUser = async (api, user, statusCode) => {
  const { firstName, lastName, username, password } = user;
  const request = api.post("/api/users");

  if (firstName) request.send({ firstName });
  if (lastName) request.send({ lastName });
  if (username) request.send({ username });
  if (password) request.send({ password });
  request.expect(statusCode);

  return (await request).body;
};

const editUser = async (api, sessionId, userEdit, statusCode) => {
  const request = api.put("/api/users/myself");

  if (sessionId) {
    request.set("Cookie", `connect.sid=${sessionId}`);
  }

  request.send(userEdit).expect(statusCode);

  return (await request).body;
};

const checkSession = async (api, sessionId) => {
  const request = api.get("/api/users/my/session");

  if (sessionId) {
    request.set("Cookie", `connect.sid=${sessionId}`);
  }

  const response = await request.expect(200);
  const { authenticated } = response.body;

  return authenticated;
};

// const getUserBlogs = async (api, statusCode, sessionId) => {
//   const request = api.get("/api/users/my/blogs");

//   if (sessionId) {
//     request.set("Cookie", `connect.sid=${sessionId}`);
//   }

//   const response = await request.expect(statusCode);
//   const blogs = response.body;

//   return blogs;
// };

module.exports = {
  insertInitialUsers,
  user,
  users,
  usersWithHashedPasswords,
  userInDb,
  usersInDb,
  deleteAll,
  parseCookie,
  login,
  logout,
  checkSession,
  //   getUserBlogs,
  nonExistentId,
  createUser,
  editUser,
};
