const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const checkForCredentials = require("../utils/checkForCredentials");

const configurePassport = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      var user = await User.findById(id);
    } catch (err) {
      done(err);
    }

    done(null, user);
  });

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      // check for any missing fields
      const { credentialsProvided, message } = checkForCredentials(
        username,
        password
      );

      if (!credentialsProvided) {
        return done(null, false, message);
      }

      // try to load the user
      try {
        var user = await User.findOne({ username });
      } catch (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, { message: "incorrect username" });
      }

      // check the password
      try {
        var same = await bcrypt.compare(password, user.passwordHash);
      } catch (err) {
        return done(err);
      }

      if (!same) {
        return done(null, false, { message: "incorrect password" });
      }

      return done(null, user);
    })
  );
};

module.exports = configurePassport;
