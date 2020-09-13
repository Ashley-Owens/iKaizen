import React from 'react';
import {Nav, Navbar} from 'react-bootstrap';



function Footer () {
    return(
       
        <Navbar>
<<<<<<< HEAD
            <nav className ="navbar fixed-bottom navbar-light bg-light">
=======
            <nav className="navbar fixed-bottom navbar-light bg-light">
>>>>>>> origin/ashley
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