import React from 'react';
import {NavItem, Nav, Container, Navbar} from 'react-bootstrap';


function Footer () {
    return(
       
        <Navbar>
            <nav className ="navbar fixed-bottom navbar-light bg-light">
            <Nav className="mr-auto">
                {/*   */}
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