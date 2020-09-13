import React from "react";
import { Nav, Navbar } from "react-bootstrap";

function Footer() {
  return (
    <Navbar bg="light">
      <Nav className="mr-auto">
        <Nav.Item>
          {/*  TODO: add contact form */}
          <Nav.Link href="#">Contact Us</Nav.Link>
        </Nav.Item>
      </Nav>
      <Nav>
        <Nav.Item className="align-middle small copyright">
          © iKaizen 2020
        </Nav.Item>
      </Nav>
    </Navbar>
  );
}

export default Footer;
