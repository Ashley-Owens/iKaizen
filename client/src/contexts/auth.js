import React, { createContext, useEffect, useState } from "react";
import useSessions from "../hooks/useSessions";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const { finished, isLoggedIn, error } = useSessions();

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (finished) {
      setLoading(false);

      if (isLoggedIn) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }

      if (error) {
        setAuthError(true);
      }
    }
  }, [finished, isLoggedIn, error]);

  return (
    <AuthContext.Provider value={{ loading, authenticated, authError }}>
      {children}
    </AuthContext.Provider>
  );
};
