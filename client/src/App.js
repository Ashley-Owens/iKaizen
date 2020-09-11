import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from 'react-bootstrap';
import NavBar from './components/NavBar';
import Greeter from './components/Greeter';
import './App.css';
import './components/NavBar.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <div>
        <NavBar/>
        <Greeter name="Ashley"/>
      </div>    
      </header>
    </div>
  );
}

export default App;
