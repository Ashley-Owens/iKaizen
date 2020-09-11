import React from 'react';
import {Modal, Button} from 'react-bootstrap'


function MyModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Log In
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Name</h4>
          <h4>Email</h4>
          <h4>User Name</h4>
          <h4>Password</h4>
          
          <p>
            If you don't have an account yet, please sign up here.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
  
export default MyModal;