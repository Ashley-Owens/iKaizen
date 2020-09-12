import React from 'react';
import {NavItem, Nav, Container} from 'react-bootstrap';


function Footer () {
    return(
        <footer>
            <Container>
                <Nav justified>
                <NavItem
                    eventKey={1}>
                    Privacy Policy
                </NavItem>
                <NavItem
                    eventKey={2}
                    title="Item">
                    Terms & Conditions
                </NavItem>
                <NavItem
                    eventKey={3}>
                    Contact US
                </NavItem>
                </Nav>
                <div className="text-center small copyright">
                © iKaizen 2020
                </div>
            </Container>
        </footer>
    )
}

export default Footer;