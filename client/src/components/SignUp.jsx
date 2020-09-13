import React from 'react';
import {Button, Form, Col, Container} from 'react-bootstrap'
import NavBar from './NavBar';
import Footer from './Footer';


function SignUp () {
    return (
<<<<<<< HEAD
        <Container className="pt-5">
            <Form>
                <p className="header-text">Let's Get Started!</p>
                <Form.Group controlId="formGroupName">
                    <Form.Label>Name</Form.Label>
                    <Form.Row>
                    <Col>
                        <Form.Control placeholder="First name" />
                    </Col>
                    <Col>
                        <Form.Control placeholder="Last name" />
                    </Col>
                    </Form.Row>
                </Form.Group>

                <Form.Group controlId="formGroupUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="username" placeholder="Enter username" />
                </Form.Group>

                <Form.Group controlId="formGridEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formGridPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                        <small id="passwordHelpInline" className="text-muted">
                            Must be 8-20 characters long.
                        </small>
                </Form.Group>

                <Button variant="info" type="submit">
                        Submit
                    </Button>
            </Form>  
=======
        
        <div className="d-flex flex-column">
            <NavBar/>

            <Container> 
                <div className="flex-grow-1 home-content-container pt-5">
                    <div className="home-content pt-5">
                <Form>
                    <p className="header-text">Let's Get Started!</p>
                    <Form.Group controlId="formGroupName">
                        <Form.Label>Name</Form.Label>
                        <Form.Row>
                        <Col>
                            <Form.Control placeholder="First name" />
                        </Col>
                        <Col>
                            <Form.Control placeholder="Last name" />
                        </Col>
                        </Form.Row>
                    </Form.Group>

                    <Form.Group controlId="formGroupUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="username" placeholder="Enter username" />
                    </Form.Group>

                    <Form.Group controlId="formGridEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formGridPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                            <small id="passwordHelpInline" class="text-muted">
                                Must be 8-20 characters long.
                            </small>
                    </Form.Group>

                    <Button variant="info" type="submit">
                            Submit
                        </Button>
                </Form>  
                </div>
            </div>
            <Footer />
>>>>>>> origin/ashley
        </Container>
    </div>
    )
}

export default SignUp;