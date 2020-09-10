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