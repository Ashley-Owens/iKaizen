import React from "react";
import useElementHeight from "../hooks/useElementHeight";
import { Button, Form, Col, Container } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import NavBar from "./NavBar";
import Footer from "./Footer";

function SignUp() {
  const [navbarHeight, navbarRef] = useElementHeight();
  const containerStyle = { marginTop: navbarHeight };

  return (
    <div className="d-flex flex-column">
      <NavBar ref={navbarRef} />
      <Container style={containerStyle} className="pt-5 flex-grow-1">
        <div className="flex-grow-1 home-content-container">
          <div className="home-content pt-1">
            <Form className="px-5">
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
      </Container>

      <Footer />
    </div>
  );
}

export default SignUp;
