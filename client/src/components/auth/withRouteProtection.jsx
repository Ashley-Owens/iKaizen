import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Spinner from "./Spinner";

export default function withRouteProtection(Component, componentProps) {
  return () => {
    const { redirectTo, ...props } = componentProps;
    const { loading, authenticated, authError } = useAuth();
    const [showSpinner, setShowSpinner] = useState(true);
    const history = useHistory();

    useEffect(() => {
      if (!loading) {
        if (authenticated) {
          setShowSpinner(false);
          return;
        }

        if (!authenticated || authError) {
          history.replace("/login");
        }
      }
    }, [loading, authenticated, authError]);

    if (showSpinner) {
      return <Spinner />;
    }

    return <Component {...props} />;
  };
}
