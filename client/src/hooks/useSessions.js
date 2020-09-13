import useSWR from "swr";
import axios from "axios";

const fetcher = async (url) => {
  const response = await axios.get(url, { withCredentials: true });
  const result = response.data;

  return { authenticated: result.authenticated };
};

export default function useAuthentication() {
  const url = "https://api-ikaizen.herokuapp.com/api/users/my/session";
  const { data, error } = useSWR(url, fetcher);
  const res = {};

  res.finished = typeof data !== "undefined";
  res.isLoggedIn = data?.authenticated;
  res.error = error;

  return res;
}
