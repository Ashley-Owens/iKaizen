import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container} from 'react-bootstrap';
import NavBar from './components/NavBar';
import SignUp from './components/SignUp';
import Footer from './components/Footer';
import Dashboard from './components/dashboard/Dashboard';
import About from './components/About';
import LogIn from './components/LogIn';
import './App.css';


export default function App() {
  return (
    <AuthProvider>
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
          {/* Dashboard needs to be Protected */}
          <Route path="/Dashboard" exact>
            <Dashboard />
          </Route>
          <Route path="/" exact>
            <Home />
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
}

function Home() {
  return (
    <div className="d-flex flex-column cover">
      <NavBar />

      <Container>
        <div className="flex-grow-1 home-content-container pt-5">
          <div className="home-content pt-1">
            <div className="text-center">
              <img
                className="logo"
                src={process.env.PUBLIC_URL + "/img/logo.png"}
                alt="logo"
              />
            </div>

            <p className="text px-5">
              iKaizen is a web application that helps its users implement kaizen
              philosophy for healthier lifestyles. Kaizen teaches that small and
              steady changes over time yield remarkable results. Are you ready
              to take the first step?{" "}
            </p>
          </div>
        </div>
        <Footer />
      </Container>
    </div>
  );
}
