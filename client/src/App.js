import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container } from "react-bootstrap";
import NavBar from "./components/NavBar";
import Greeter from "./components/Greeter";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <NavBar />
          <Container>
            <Greeter name="Ashley" />

            <Button>Test</Button>
          </Container>
        </div>
      </header>
    </div>
  );
}

export default App;
