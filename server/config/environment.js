require("dotenv").config();

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;
const SESSION_SECRET = process.env.SESSION_SECRET;
const SESSION_STORE_SECRET = process.env.SESSION_STORE_SECRET;

let MONGODB_URI = process.env.MONGODB_URI;

if (process.env.NODE_ENV === "test") {
  MONGODB_URI = process.env.TEST_MONGODB_URI;
}

module.exports = {
  NODE_ENV,
  PORT,
  MONGODB_URI,
  SESSION_SECRET,
  SESSION_STORE_SECRET,
};
