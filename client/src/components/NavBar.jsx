<<<<<<< HEAD
import React from "react";
import { Navbar, Nav, Form, Button, Container } from "react-bootstrap";

function NavBar() {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#home">Navbar</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#features">Features</Nav.Link>
          <Nav.Link href="#pricing">Pricing</Nav.Link>
        </Nav>
        <Form inline>
          <Form.Control type="text" placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-info">Search</Button>
        </Form>
      </Container>
    </Navbar>
  );
=======
import React from 'react';
import {Navbar, Nav, Form, Button} from 'react-bootstrap';


function NavBar() {

    return (
        
        <Navbar bg="dark" variant="dark">
            {/* Left aligned items */}
            <Nav className="mr-auto">
            <Navbar.Brand href="./">iKaizen</Navbar.Brand>
            <Nav.Link href="./About">About</Nav.Link>
            <Nav.Link href="./Dashboard">Dashboard</Nav.Link>
            </Nav>
            
            <Nav>
            {/* Right-aligned items */}
                <Nav.Link href="./LogIn">
                <Button variant="outline-info">Log In</Button></Nav.Link>
                <Nav.Link href="./SignUp">
                    <Button variant="info">Sign Up</Button>
                </Nav.Link>
            </Nav>
        </Navbar>
    )
>>>>>>> origin/ashley
}
<<<<<<< HEAD
export default NavBar;
=======

export default NavBar;
>>>>>>> origin/ashley
