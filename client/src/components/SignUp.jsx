import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { mutate } from "swr";
import useElementHeight from "../hooks/useElementHeight";
import { Button, Form, Col, Container } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import { register } from "../api/users";
import NavBar from "./NavBar";
import Footer from "./Footer";
import Spinner from "./auth/Spinner";

function SignUp() {
  const [registering, setRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();

  const [navbarHeight, navbarRef] = useElementHeight();
  const containerStyle = { marginTop: navbarHeight };

  const schema = yup.object({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    username: yup.string().required("required"),
    email: yup.string().email().required("required"),
    password: yup.string().required("required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(false);
    setErrorMessage("");
    setRegistering(true);

    const { error } = await register({
      firstName: values.firstName,
      lastName: values.lastName,
      username: values.username,
      email: values.email,
      password: values.password,
    });

    const url = "https://ikaizen-server.herokuapp.com/api/users/my/session";
    mutate(url);

    if (!error) {
      history.push("/", { fromSignup: true, firstName: values.firstName });
    } else {
      setErrorMessage(error);
      setRegistering(false);
    }
  };

  if (registering) {
    return <Spinner />;
  }

  return (
    <div className="d-flex flex-column">
      <NavBar ref={navbarRef} />
      <Container style={containerStyle} className="pt-5 flex-grow-1">
        <div className="flex-grow-1 home-content-container">
          <div className="home-content pt-1">
            <Formik
              validationSchema={schema}
              onSubmit={handleSubmit}
              initialValues={{
                firstName: "",
                lastName: "",
                username: "",
                email: "",
                password: "",
              }}
            >
              {({ handleChange, handleSubmit, values, touched, errors }) => {
                return (
                  <Form noValidate className="px-5" onSubmit={handleSubmit}>
                    {errorMessage ? (
                      <div className="small mb-3 text-danger">
                        {errorMessage}
                      </div>
                    ) : null}
                    <p className="header-text">Let's Get Started!</p>
                    <Form.Group>
                      <Form.Label htmlFor="name">Name</Form.Label>
                      <Form.Row>
                        <Col id="name">
                          <Form.Control
                            name="firstName"
                            placeholder="First name"
                            onChange={handleChange}
                            value={values.firstName}
                            isInvalid={touched.firstName && errors.firstName}
                            autoComplete="off"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.firstName}
                          </Form.Control.Feedback>
                        </Col>
                        <Col>
                          <Form.Control
                            name="lastName"
                            placeholder="Last name"
                            onChange={handleChange}
                            value={values.lastName}
                            isInvalid={touched.lastName && errors.lastName}
                            autoComplete="off"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.lastName}
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Row>
                    </Form.Group>

                    <Form.Group controlId="username">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        name="username"
                        placeholder="Enter username"
                        onChange={handleChange}
                        value={values.username}
                        isInvalid={touched.username && errors.username}
                        autoComplete="off"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.username}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        onChange={handleChange}
                        value={values.email}
                        isInvalid={touched.email && errors.email}
                        autoComplete="off"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                      </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                        value={values.password}
                        isInvalid={touched.password && errors.password}
                        autoComplete="off"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                      <small id="passwordHelpInline" className="text-muted">
                        Must be 8-20 characters long.
                      </small>
                    </Form.Group>

                    <Button variant="info" type="submit">
                      Submit
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </Container>

      <Footer />
    </div>
  );
}

export default SignUp;
