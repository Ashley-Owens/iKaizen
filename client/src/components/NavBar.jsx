import React from 'react';
import {Navbar, Nav, Form, Button} from 'react-bootstrap';
import MyModal from './MyModal';
import './NavBar.css';


function NavBar() {
    const [modalShow, setModalShow] = React.useState(false);

    return (
        
        <Navbar bg="dark" variant="dark">
            <Nav className="mr-auto">
            <Nav.Link href="./">Home</Nav.Link>
            <Nav.Link href="./About">About</Nav.Link>
            <Nav.Link href="./MyModal" onClick={() => setModalShow(true)}>Log In</Nav.Link>
            <MyModal show={modalShow} onHide={() => setModalShow(false)}/>
            {/* <Navbar.Brand href="#home">iKaizen</Navbar.Brand> */}
            </Nav>
            <Form inline>
            <Form.Control type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-info">Search</Button>
            </Form>
        </Navbar>
    )
}

export default NavBar;