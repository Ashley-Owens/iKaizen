import React from "react";
import { Spinner as BootstrapSpinner } from "react-bootstrap";
import "./spinner.css";

export default function Spinner() {
  return (
    <div className="spinner-container">
      <BootstrapSpinner animation="border" role="status" variant="info">
        <span className="sr-only">Loading...</span>
      </BootstrapSpinner>
    </div>
  );
}
