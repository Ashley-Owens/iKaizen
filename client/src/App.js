<<<<<<< HEAD
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container } from "react-bootstrap";
import NavBar from "./components/NavBar";
import Greeter from "./components/Greeter";
import "./App.css";
=======
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from 'react-bootstrap';
import NavBar from './components/NavBar';
import MyModal from './components/MyModal';
import Greeter from './components/Greeter';
import './App.css';

>>>>>>> origin/ashley

function App() {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    
    <div className="App">
      <header className="App-header">
<<<<<<< HEAD
        <div>
          <NavBar />
          <Container>
            <Greeter name="Ashley" />

            <Button>Test</Button>
          </Container>
        </div>
=======
      <div>
        <NavBar/>
        <>
        <Button variant="primary" onClick={() => setModalShow(true)}>
          Launch vertically centered modal
        </Button>
  
        <MyModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      </>
        <Greeter name="Ashley"/>
      </div>    
>>>>>>> origin/ashley
      </header>
    </div>
  );
}

export default App;
