import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from 'react-bootstrap';
import NavBar from './components/NavBar';
import MyModal from './components/MyModal';
import Greeter from './components/Greeter';
import './App.css';
import './components/NavBar.css';

function App() {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    
    <div className="App">
      <header className="App-header">
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
      </header>
    </div>
  );
}

export default App;
