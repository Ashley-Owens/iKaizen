import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import useElementHeight from "../hooks/useElementHeight";
import { Formik } from "formik";
import * as yup from "yup";
import { Button, Form, Container } from "react-bootstrap";
import { mutate } from "swr";
import { login } from "../api/users";
import NavBar from "./NavBar";
import Footer from "./Footer";
import Spinner from "./auth/Spinner";

function LogIn() {
  const [navbarHeight, navbarRef] = useElementHeight();
  const containerStyle = { marginTop: navbarHeight };

  const [authenticating, setAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();

  const schema = yup.object({
    username: yup.string().required("required"),
    password: yup.string().required("required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(false);
    setErrorMessage("");
    setAuthenticating(true);

    const { authenticated, error } = await login(
      values.username,
      values.password
    );

    const url = "http://localhost:3001/users/my/session";
    mutate(url);

    if (authenticated) {
      history.push("/dashboard");
    } else {
      setErrorMessage(error);
      setAuthenticating(false);
    }
  };

  if (authenticating) {
    return <Spinner />;
  }

  return (
    <div className="d-flex flex-column">
      <NavBar ref={navbarRef} />
      <Container style={containerStyle} className="pt-5 flex-grow-1">
        <Formik
          validationSchema={schema}
          onSubmit={handleSubmit}
          initialValues={{
            username: "",
            password: "",
          }}
        >
          {({ handleChange, handleSubmit, touched, errors }) => {
            return (
              <Form noValidate onSubmit={handleSubmit}>
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
              </Form>
            );
          }}
        </Formik>
      </Container>
      <Footer />
    </div>
  );
}
export default LogIn;
