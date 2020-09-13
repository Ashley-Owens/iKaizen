import React, { useCallback, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import NavBar from "./components/NavBar";
import SignUp from "./components/SignUp";
import Footer from "./components/Footer";
import Dashboard from "./components/dashboard/Dashboard";
import About from "./components/About";
import LogIn from "./components/LogIn";
import useElementHeight from "./hooks/useElementHeight";
import "./App.css";

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
  const containerStyle = { marginTop: navbarHeight };

  return (
    <>
      <div className="d-flex flex-column cover">
        <NavBar ref={navbarRef} />
        <Container
          style={containerStyle}
          className="flex-grow-1 home-content-container pt-5"
        >
          <div className="home-content pt-2">
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
