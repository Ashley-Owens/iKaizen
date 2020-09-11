import React from 'react';
import {NavItem, Nav, Container} from 'react-bootstrap';
import "./Footer.css";

function Footer () {
    return(
        <footer>
            <Container>
                <Nav justified>
                <NavItem
                    eventKey={1}>
                    Privacy policy
                </NavItem>
                <NavItem
                    eventKey={2}
                    title="Item">
                    Terms & Conditions
                </NavItem>
                <NavItem
                    eventKey={3}>
                    Some other professional link
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