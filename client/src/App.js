import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from 'react-bootstrap';
import NavBar from './components/NavBar';
import MyModal from './components/MyModal';
import Greeter from './components/Greeter';
import './App.css';
import Footer from './components/Footer';


function App() {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    
    <div className="App">
      <header className="App-header">
      <div id="content">
        <NavBar/>
        <>
        <Button variant="info" onClick={() => setModalShow(true)}>
          Sign Up
        </Button>

        <MyModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      </>
        <Greeter name="Ashley"/>
        </div>
      </header>
      
       
        <Footer />
          
      </div>
  );
}

export default App;
