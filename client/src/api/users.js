import axios from "axios";

const root = "https://ikaizen-server.herokuapp.com/api/users";

const login = async (username, password) => {
  try {
    await axios.post(
      `${root}/login`,
      { username, password },
      { withCredentials: true }
    );
  } catch (err) {
    const unauthorized = err.response && err.response.status === 401;

    return {
      error: unauthorized ? "Invalid username or password" : err.message,
    };
  }

  return { authenticated: true };
};

const register = async (userInfo) => {
  try {
    await axios.post(`${root}`, userInfo);
  } catch (err) {
    return { error: err.message };
  }

  return {};
};

const logout = async () => {
  try {
    await axios.get(`${root}/logout`, { withCredentials: true });
  } catch (err) {
    return;
  }
};

export { login, register, logout };
