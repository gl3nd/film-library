import { Container, Navbar, Form, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';



function MyNavBar(props) {
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Navigate to a results page; you'll need to build a component
    // that reads the query string and calls your `searchFilm` function
    navigate(`/search?title=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand as={Link} to="/"><img
          src="/logos/film.svg"
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt="FilmLibrary Logo"
        />Film Library</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">

          <Form className="d-flex mx-auto">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value={props.searchTerm}
              onChange={(e) => props.setSearchTerm(e.target.value)}
            />
          </Form>
          <Navbar.Brand href="#">
            {(!props.user) ? <LogInButton /> : <LogOutButton user={props.user} handleLogOut={props.handleLogOut} />}
          </Navbar.Brand>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function LogOutButton(props) {
  const navigate = useNavigate();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <p style={{ margin: 0, fontSize: "1rem" }}>{`Logged in as ${props.user.name}`}</p >
      <Button
        variant='warning'
        onClick={() => {
          props.handleLogOut();
          navigate("../login");
        }}
      >LogOut</Button>
    </div>
  );
}

function LogInButton() {
  const navigate = useNavigate();
  return (
    <img
      onClick={() => navigate("../login")}
      src="/logos/person-circle.svg"
      width="30"
      height="30"
      className="d-inline-block align-top"
      alt="UserLogo"
    />
  );
}



export default MyNavBar;