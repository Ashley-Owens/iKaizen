import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Button} from 'react-bootstrap';
import NavBar from './components/NavBar';
import SignUp from './components/SignUp';
import Greeter from './components/Greeter';
import './App.css';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import About from './components/About';
import LogIn from './components/LogIn';


export default function App() {
  const [modalShow, setModalShow] = React.useState(false);
  
  return (
    <Router>
    <div className="Container">
      <NavBar/>
      <Switch>
        <Route path="/SignUp">
          <SignUp />
        </Route>
        <Route path="/LogIn">
          <LogIn />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        {/* Dashboard needs to be Protected */}
        <Route path="/Dashboard">
          <Dashboard /> 
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
      </div>
  </Router>
  );
}


function Home() {
  return (
    <div>
      <h4>I'm the Home Page</h4>
      <footer id="content">
          <Footer />
        </footer>
    </div>
  )
}
