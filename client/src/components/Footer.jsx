import React from 'react';
import {Nav, Navbar} from 'react-bootstrap';



function Footer () {
    return(
       
        <Navbar>
            <nav className="navbar fixed-bottom navbar-light bg-light">
            <Nav className="mr-auto">
                {/*  TODO: add contact form */}
                <Nav.Link href="#">Contact Us</Nav.Link>
            </Nav>
                <nav className="text-center small copyright">
                    © iKaizen 2020
                </nav>
            </nav>
        </Navbar>
    )
}

export default Footer;