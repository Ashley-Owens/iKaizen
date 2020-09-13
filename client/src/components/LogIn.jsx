import React from 'react';
import {Button, Form, Container} from 'react-bootstrap'
import NavBar from './NavBar';
import Footer from './Footer';


function LogIn () {
    return (
        <>
        <NavBar/>
        <Container className="pt-5 px-5">
            <Form>
            <div className="nav-padding">
                <p className="header-text">Please sign in to your account</p>
                <Form.Group controlId="formGroupUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="username" placeholder="Enter username" />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Remember me" />
                </Form.Group>
                <Button variant="info" type="submit">
                    Submit
                </Button>
                </div>
            </Form>
            <Footer />
        </Container>
    </>
    )
}

export default LogIn;