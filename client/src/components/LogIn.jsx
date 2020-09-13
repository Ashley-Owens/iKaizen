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
                {errorMessage ? (
                  <div className="small mb-3 text-danger">{errorMessage}</div>
                ) : null}
                <Form.Group controlId="formGroupUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    name="username"
                    placeholder="Enter username"
                    onChange={handleChange}
                    isInvalid={touched.username && errors.username}
                    autoComplete="off"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    isInvalid={touched.password && errors.password}
                    autoComplete="off"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
                {/* <Form.Group controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Remember me" />
            </Form.Group> */}
                <Button variant="info" type="submit">
                  Submit
                </Button>
                </div>
            </Form>
            <Footer />
        </Container>
    </>
  );
}

export default LogIn;
