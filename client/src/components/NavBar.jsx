import React from 'react';
import {Navbar, Nav, Form, Button} from 'react-bootstrap';
import './components/NavBar.css';


function NavBar() {
    return (
        <Navbar bg="dark" variant="dark">
            <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#SignIn">Sign In</Nav.Link>
            <Navbar.Brand href="#home">iKaizen</Navbar.Brand>
            </Nav>
            <Form inline>
            <Form.Control type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-info">Search</Button>
            </Form>
        </Navbar>
    )
}
export default NavBar;