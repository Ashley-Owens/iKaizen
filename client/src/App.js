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
import Greeter from './components/Greeter';
import './App.css';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import About from './components/About';
import MyModal from './components/MyModal';


export default function App() {
  const [modalShow, setModalShow] = React.useState(false);
  
  return (
    <Router>
    <div className="App">
      <div id="content">
        <NavBar/>
        <Switch>
          <Route path="/MyModal">
            <MyModal />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/">
            <Home />
          </Route>
          {/* Dashboard needs to be Protected
          <Route path="/Dashboard">
            <Dashboard />  */}
        </Switch>
      </div>
      <body>
        <div class="container zone"><img class="cover" src="./img/undraw.png"></img>
        </div>
          <Button variant="info" to="./MyModal" onClick={() => setModalShow(true)}>Sign Up</Button>
          <MyModal show={modalShow} onHide={() => setModalShow(false)}/>
        {/* </div> */}
      </body>
      <Footer />
    </div>
  </Router>
  );
}


function Home() {
  return <h3>I'm the Home page</h3>;
}
