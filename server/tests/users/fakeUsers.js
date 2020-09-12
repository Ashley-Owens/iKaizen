const initialUsers = [
  {
    firstName: "hello",
    lastName: "world",
    username: "user",
    password: "hunter1",
  },
  {
    firstName: "hello",
    lastName: "world",
    username: "testuser",
    password: "testpassword",
  },
  {
    firstName: "hello",
    lastName: "world",
    username: "hello",
    password: "world",
  },
  {
    firstName: "hello",
    lastName: "world",
    username: "user3",
    password: "password",
  },
];

const initialUsersWithHashedPasswords = [
  {
    firstName: "hello",
    lastName: "world",
    username: "user",
    passwordHash:
      "$2b$14$kdKpR15NLdljdMQxEKeghuLTFKktTx8gRhIiVxLJdfjQdUMHxz5eq",
  },
  {
    firstName: "hello",
    lastName: "world",
    username: "testuser",
    passwordHash:
      "$2b$14$8cAdaK/gXhwZlz9BmoWbrOK0lNhqUSUcBCTtLIjY1FkKmV4jtB.Za",
  },
  {
    firstName: "hello",
    lastName: "world",
    username: "hello",
    passwordHash:
      "$2b$14$owGODIIH1rWipurnYhXLn.Gaz4dnN7mFWl8HbimHg6KMyRdA7FBjq",
  },
  {
    firstName: "hello",
    lastName: "world",
    username: "user3",
    passwordHash:
      "$2b$14$h7gbyJ6n3UrIm.K.yACL4uzJ3sgIvJY2KK24nadMkILAuwD26yGTW",
  },
];

module.exports = {
  initialUsers,
  initialUsersWithHashedPasswords,
};
