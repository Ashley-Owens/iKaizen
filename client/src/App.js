import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from 'react-bootstrap';
import NavBar from './components/NavBar';
import MyModal from './components/MyModal';
import Greeter from './components/Greeter';
import './App.css';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import About from './components/About';


export default function App() {
  const [modalShow, setModalShow] = React.useState(false);
  
  
  return (
    <Router>
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="Dashboard">Dashboard</Link>
          </li>
        </ul>
      </nav>

      {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
      <Switch>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/Dashboard">
          <Dashboard />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </div>
  </Router>
    
    
    // <Router>
    // <div className="App">
    //   <header className="App-header">
    //   <div id="content">
    //     <NavBar/>
    //     <>
    //     <Button variant="info" onClick={() => setModalShow(true)}>
    //       Sign Up
    //     </Button>

    //     <MyModal
    //       show={modalShow}
    //       onHide={() => setModalShow(false)}
    //     />
    //   </>
    //     <Greeter name="Ashley"/>
    //     {/* A <Switch> looks through its children <Route>s and
    //         renders the first one that matches the current URL. */}
    //     <Switch>
    //       <Route path="components/about">
    //         <About />
    //       </Route>
    //       <Route path="components/Dashboard">
    //         <Dashboard />
    //       </Route>
    //       <Route path="/">
    //         <Home />
    //       </Route>
    //     </Switch>
    //     </div>
    //   </header>
       
    //     <Footer />
    //   </div>
    // </Router>
  );
}


    

function Home() {
  return <h2>I'm the Home page</h2>;
}
