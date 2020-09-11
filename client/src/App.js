import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from 'react-bootstrap';
import NavBar from './components/NavBar';
import Greeter from './components/Greeter';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <div>
        <NavBar/>
        <Greeter name="Ashley"/>
        
        <Button>Test</Button>
      </div>    
      </header>
    </div>
  );
}

export default App;
