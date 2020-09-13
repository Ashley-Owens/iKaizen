import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Container } from "react-bootstrap";
import NavBar from "./components/NavBar";
import SignUp from "./components/SignUp";
import Footer from "./components/Footer";
import Dashboard from "./components/dashboard/Dashboard";
import Dashboard2 from "./components/dashboard/Dashboard2";
import About from "./components/About";
import LogIn from "./components/LogIn";
import "./App.css";
import useElementHeight from "./hooks/useElementHeight";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/SignUp" exact>
          <SignUp />
        </Route>
        <Route path="/LogIn" exact>
          <LogIn />
        </Route>
        <Route path="/about" exact>
          <About />
        </Route>
        <Route path="/Dashboard" exact>
          <Dashboard />
        </Route>
        <Route path="/" exact>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

function Home() {
  const [navbarHeight, navbarRef] = useElementHeight();
  const [fromSignup, setFromSignup] = useState(false);
  const containerStyle = { marginTop: navbarHeight };
  const history = useHistory();

  useEffect(() => {
    const redirectedFromSignup =
      history.location &&
      history.location.state &&
      history.location.state.fromSignup;

    if (redirectedFromSignup) {
      setFromSignup(true);

      setTimeout(() => {
        setFromSignup(false);
        history.replace("/", {});
      }, 8000);
    }
  }, [history]);

  return (
    <>
      <div className="d-flex flex-column cover">
        <NavBar ref={navbarRef} />
        <Container
          style={containerStyle}
          className="flex-grow-1 home-content-container pt-5"
        >
          <div className="home-content pt-2">
            {fromSignup ? (
              <Alert variant="info">
                {`You successfully created an account, ${history.location.state.firstName}! Log in to access your
                dashboard.`}
              </Alert>
            ) : null}
            <div className="text-center">
              <img
                className="logo"
                src={process.env.PUBLIC_URL + "/img/logo.png"}
                alt="logo"
              />
            </div>

            <p className="home-text pt-2 px-5">
              iKaizen is a web application that helps its users implement kaizen
              philosophy for personal growth and healthy lifestyle changes.
              Kaizen teaches that small and steady changes over time yield
              remarkable results. Are you ready to take the first step?{" "}
            </p>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
}
