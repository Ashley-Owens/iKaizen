import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Image} from 'react-bootstrap';
import NavBar from './components/NavBar';
import SignUp from './components/SignUp';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import About from './components/About';
import LogIn from './components/LogIn';
import './App.css';


export default function App() {
  
  return (
    <Router>
      <NavBar/>
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
      <Footer />
  </Router>
  );
}


function Home() {
  return (
  
    <div className="cover">
      <img className="logo" src={process.env.PUBLIC_URL + '/img/logo.png'} alt="logo" />
      <p className="text">iKaizen is a web application that aims to help its users implement the kaizen philosophy. Kaizen teaches that small and steady changes over time yield remarkable results. Are you ready to take the first step? </p>
  </div> 
  )
}
