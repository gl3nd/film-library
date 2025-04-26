// Login.js:
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Navbar, Alert } from 'react-bootstrap';
import API from '../API.js'
import {useNavigate} from 'react-router-dom';
import MyFooter from './ MyFooterComponent.jsx';


function Login({handleLogIn}) {

  const [email, setEmail] = useState('u1@p.it');
  const [password, setPassword] = useState('pwd');
  const [errMsg,setErrMsg] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = {email:email, password:password};
    console.log('Login attempted with:', {credentials});
    if(!email){
      setErrMsg("Email can not be empty!");
    }
    else if(!password){
      setErrMsg("Password can not be empty");
    }
    else{
    handleLogIn(credentials)
      .then(()=>navigate('/'))
      .catch(err=>{
        const message =
        typeof err === 'object' && err.message ? err.message : String(err);
      setErrMsg(message);
    });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar expand="lg" bg='light'> 
      <Navbar.Brand>
        <img
            style={{marginLeft:'10px'}}
            src="/logos/film.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="FilmLibrary Logo"
          />Film Library</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
    </Navbar>
    <div style={{ flex: 1 }}>
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">Login</h2>
          <Form onSubmit={handleSubmit}>
          {errMsg &&( <Alert dismissible onClose={() => setErrMsg('')} variant="danger">{errMsg}</Alert> )}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
    </div>
    <MyFooter></MyFooter>
    </div>
  );
}

export default Login;