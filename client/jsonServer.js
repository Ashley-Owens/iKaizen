const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const session = require("express-session");
const uid = require("uid");

const users = {
  user: {
    id: uid(),
    username: "user",
    password: "hunter1",
  },
  testuser: {
    id: uid(),
    username: "testuser",
    password: "testpassword",
  },
  hello: {
    id: uid(),
    username: "hello",
    password: "world",
  },
  user3: {
    id: uid(),
    username: "user3",
    password: "password",
  },
};

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use(
  session({
    secret: "supersecret",
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
    resave: false,
    saveUninitialized: false,
    rolling: true,
  })
);

server.post("/users", (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  if (users.username) {
    return res.status(400).json({ error: "duplicate username" });
  }

  const user = { id: uid(), username, password };
  users[username] = user;

  res.status(201).json({ firstName, lastName, username, email, password });
});

server.post("/users/login", (req, res) => {
  let { username, password } = req.body;
  username = username.toLowerCase();
  password = password.toLowerCase();
  const user = users[username];

  if (!user) {
    return res.status(401).json({ error: "invalid username" });
  }

  if (user.username === username && user.password === password) {
    req.session.user = username;
    return res.status(200).end();
  }

  return res.status(401).json({ error: "invalid password" });
});

server.get("/users/logout", (req, res) => {
  if (req.session.user) {
    req.session.destroy();
  }

  res.status(200).end();
});

server.get("/users/my/session", (req, res) => {
  if (req.session.user) {
    return res.json({ authenticated: true });
  }

  res.json({ authenticated: false });
});

// use default router after the above routes
server.use(router);

server.listen("3001", () => {
  console.log("server listening on port 3001");
});
