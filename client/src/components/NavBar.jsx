import React, { forwardRef } from "react";
import { Navbar, Nav, Button } from "react-bootstrap";

const NavBar = forwardRef((props, ref) => {
  return (
    <Navbar fixed="top" bg="dark" variant="dark" ref={ref}>
      {/* Left aligned items */}
      <Nav className="mr-auto">
        <Navbar.Brand href="./">iKaizen</Navbar.Brand>
        <Nav.Link href="./About">About</Nav.Link>
        <Nav.Link href="./Dashboard">Dashboard</Nav.Link>
      </Nav>

      <Nav>
        {/* Right-aligned items */}
        <Nav.Link href="./LogIn">
          <Button variant="outline-info">Log In</Button>
        </Nav.Link>
        <Nav.Link href="./SignUp">
          <Button variant="info">Sign Up</Button>
        </Nav.Link>
      </Nav>
    </Navbar>
  );
});

export default NavBar;
