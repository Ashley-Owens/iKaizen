import React from 'react';
import {Navbar, Nav, Form, Button} from 'react-bootstrap';


function NavBar() {

    return (
        
        <Navbar bg="dark" variant="dark">
            <Nav className="mr-auto">
            <Nav.Link href="./">Home</Nav.Link>
            <Nav.Link href="./About">About</Nav.Link>
            <Nav.Link href="./Dashboard">Dashboard</Nav.Link>

            {/* Trying to right align this item */}
            <div className="justify-content-end">
                <Nav.Link href="./LogIn">Log In</Nav.Link>
            </div>
            
            {/* <Navbar.Brand href="#home">iKaizen</Navbar.Brand> */}
            </Nav>
            <Form inline>
            <Form className="mr-sm-2"/>
            <Nav.Link href="./SignUp">
                <Button variant="outline-info">Sign Up</Button>
            </Nav.Link>
            </Form>
        </Navbar>
    )
}

export default NavBar;