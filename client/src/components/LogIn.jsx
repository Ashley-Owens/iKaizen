import React from 'react';
import {Button, Form, Container} from 'react-bootstrap'


function LogIn () {
    return (
        <Container className="pt-5">
            <Form>
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
            </Form>
        </Container>
    )
}

export default LogIn;