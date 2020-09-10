/**
 * Checks whether both the username and the password parameters are provided.
 * This is used for validating a login request.
 * @param {string} username - The username of a user
 * @param {string} password - The password of a user
 */
const checkForCredentials = (username, password) => {
  if (!username && !password) {
    return {
      credentialsProvided: false,
      message: "username and password required",
    };
  } else if (!username) {
    return { credentialsProvided: false, message: "username required" };
  } else if (!password) {
    return { credentialsProvided: false, message: "password required" };
  } else {
    return { credentialsProvided: true };
  }
};

module.exports = checkForCredentials;
