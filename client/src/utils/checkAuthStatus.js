import axios from "axios";

export default async function checkAuthStatus() {
  const url = "http://localhost:3001/users/my/session";

  try {
    const response = await axios.get(url, { withCredentials: true });
    return { authenticated: response.data.authenticated };
  } catch (error) {
    if (error.response) {
      return { error: error.response.data };
    }

    return { error: error.message };
  }
}
