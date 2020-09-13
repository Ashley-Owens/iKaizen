// import React, { useEffect, useState } from "react";
// import checkAuthStatus from "../utils/checkAuthStatus";

// export default async function useSession() {
//   const [loading, setLoading] = useState(true);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [authError, setAuthError] = useState(null);

//   const { authenticated, error } = await checkAuthStatus();

//   useEffect(() => {
//     if (authenticated) {
//       setIsLoggedIn(true);
//     } else {
//       setAuthError(error);
//     }

//     setLoading(false);
//   }, [authenticated, error]);

//   return { loading, isLoggedIn, authError };
// }

import useSWR from "swr";
import axios from "axios";

const fetcher = async (url) => {
  const response = await axios.get(url, { withCredentials: true });
  const result = response.data;

  return { authenticated: result.authenticated };
};

export default function useAuthentication() {
  const url = "http://localhost:3001/users/my/session";
  const { data, error } = useSWR(url, fetcher);
  const res = {};

  res.finished = typeof data !== "undefined";
  res.isLoggedIn = data?.authenticated;
  res.error = error;

  return res;
}
