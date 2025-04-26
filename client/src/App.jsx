import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Tab from 'react-bootstrap/Tab';
import InputGroup from 'react-bootstrap/InputGroup';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {BrowserRouter, Routes, Route, Outlet, Navigate, useNavigate, Link, useParams} from 'react-router-dom'
import BasicExample from './components/LogInComponent.jsx';


import dayjs from 'dayjs';
import { seenLastMonth,bestRatedFilms,unseenFilms,favoriteFilms} from './films.js';
import FormComponent from './components/FormComponent.jsx';
import AddFilmButton from './components/ShowFormButton.jsx';
import MyNavBar from './components/NavBarComponent.jsx';
//import FilmRow from './components/TableComponents.jsx';
import TableOfFilms from './components/TableComponents.jsx'
import MyFooter from './components/ MyFooterComponent.jsx';
import API from './API.js';
import LogIN from './components/LogInComponent.jsx';


function App() {
  const [loggedIn,setLoggedIn] = useState(false);
  const [user,setUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [allFilms,setAllFilms] = useState([]);
  const [filmList, setfilmList] = useState([]);
  const [dirty,setDirty] = useState(true);

  useEffect(()=>{
    const auth = async() =>{
    try{
      const usr = await API.getUserInfo();
      if(usr !== undefined){
      setLoggedIn(true);
      setUser(usr);
      console.log(`User ${usr.name} authenticated`)
    }else{
      setLoggedIn(false);
    }
    }catch(e){
      console.error("Failed to Log in",e);
      setLoggedIn(false);
    }
    };
    auth(); 
  },[])

  const handleLogIn = async (credentials) => {
    try{
      const user = await API.logIn(credentials);
      if(!user || user.error){
        throw new Error(user?.error || "Login Failed");
      }
      setUser(user);
      setLoggedIn(true);
      return user;
    }catch(e){
      throw(e);
    }
  }
  const handleLogOut = async () =>{
    await API.logOut();
    setLoggedIn(false);
    setUser(null);
    setfilmList([]);
  }

  
  useEffect( ()=>{
    if(dirty){ 
    API.getFilms()
    .then(f => {
      setfilmList(f);
      setAllFilms(f)
      setDirty(false);
    })
    .catch((err)=>console.log(err))
  }
  },[dirty])

  useEffect( ()=>{
    if (searchTerm.trim() === "") {
      setfilmList(allFilms);
    } else {
      const filtered = allFilms.filter((film) =>
        film.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setfilmList(filtered);
    }
  }, [searchTerm,allFilms]);
  
  function addFilm(newFilm) {
    setfilmList((currentList) => [...currentList, newFilm]);
    setDirty(true)
  }

  function deleteFilm(id){
    API.deleteFilm(id).then(()=>{setDirty(true) ;console.log("Film deleted")}).catch(e=>console.log(e));
  }

  function editFilm(filmToBeEdited) {
    API.editFilm(filmToBeEdited).then(()=> {setDirty(true); console.log("Film updated")}).catch(e=>console.log(e));
  }

  const filters = {
    'all': { label: 'All', url: '/', filterFunction: () => true },
    'favorite': { label: 'Favorites', url: '/filter/favorite', filterFunction: film => film.favorite },
    'best': { label: 'Best Rated', url: '/filter/best', filterFunction: film => film.rating >= 5 },
    'lastmonth': { label: 'Seen Last Month', url: '/filter/lastmonth', filterFunction: film => isSeenLastMonth(film) },
    'unseen': { label: 'Unseen', url: '/filter/unseen', filterFunction: film => film.watchDate ? false : true }
  };

  return (
    <BrowserRouter>
      <Routes>

          {/* Protected Routes */ }
        <Route path="/" element={loggedIn ? <Layout user={user} handleLogOut={handleLogOut} searchTerm={searchTerm} setSearchTerm={setSearchTerm}/> : <Navigate replace to='/login' />}>
          <Route index element={ <FilmListRoute filmList={filmList} deleteFilm={deleteFilm} editFilm={editFilm} filter={filters} setFilms={setfilmList} /> } />
          <Route path="filter/:filterId" element={<FilmListRoute filmList={filmList} deleteFilm={deleteFilm} editFilm={editFilm} filter={filters} setFilms={setfilmList} /> } />
          {/* Add new film */}
          <Route path="add" element={ <FilmFormRoute addFilm={addFilm} /> } />
          {/* Edit an existing film (filmId is passed in the URL) */}
          <Route path="edit/:filmId" element={ <FilmFormRoute filmList={filmList} editFilm={editFilm} /> } />
        </Route>
        <Route path="/login" element={!loggedIn? <LogIN handleLogIn={handleLogIn} /> : <Navigate replace to='/' />}/>
        {/*<Route path="/search"element={<FilmListRoute filmList={filmList} deleteFilm={deleteFilm} editFilm={editFilm} filter={filters} setFilms={setfilmList}/>}/>*/}
        <Route path="*" element={<DefaultRoute />} />     
      </Routes>
    </BrowserRouter>
  );
}


function Layout(props){
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <MyNavBar handleLogOut={props.handleLogOut}  user={props.user} searchTerm={props.searchTerm} setSearchTerm={props.setSearchTerm}/>
    <div style={{ flex: 1 }}>
    <Container fluid >
     
      <Tab.Container id="list-group-tabs-example" defaultActiveKey="#all">
        <Row>
          <Col sm={4} style={{marginTop :"10px"}}>
            <ListGroup>
              <ListGroup.Item action onClick={()=>{navigate("filter/all");props.setSearchTerm("")}}>All</ListGroup.Item>
              <ListGroup.Item action onClick={()=>{navigate("filter/favorite");props.setSearchTerm("")}}>Favorite</ListGroup.Item>
              <ListGroup.Item action onClick={()=>{navigate("filter/best");props.setSearchTerm("")}}>Best Rated</ListGroup.Item>
              <ListGroup.Item action onClick={()=>{navigate("filter/lastmonth");props.setSearchTerm("")}}>Seen Last Month</ListGroup.Item>
              <ListGroup.Item action onClick={()=>{navigate("filter/unseen");props.setSearchTerm("")}}>Unseen</ListGroup.Item>
            </ListGroup>
          </Col>
          <Col sm={8}>
            <Outlet/>
          </Col>
        </Row>
      </Tab.Container>  
     </Container>
      </div>
      <MyFooter></MyFooter>
    </div>
  )
}

function FilmListRoute({ filmList, deleteFilm, editFilm, filter, setFilms}) {
  const {filterId} = useParams();
  const filterQuery = filterId || "";

  useEffect(()=>{filter
    API.getFilteredFilms(filterQuery).then(f => {setFilms(f)}).catch(e=>console.log(e));
  },[filterQuery])
  
  const currFilter = filter[filterQuery] || {label : "All"};
  return (
    <>
      <Row className="mb-3">
        <Col>
        <div className="d-flex justify-content-between align-items-center mb-3" style={{margin : "5px"}}>
          <h2>{currFilter.label }</h2>
          <Link to="/add">
          <i 
      className="bi bi-plus-square"
      style={{ fontSize: "35px", textAlign: 'right', marginRight: '18px', cursor: "pointer" }} 
      alt="Show add film form"
    />
          </Link>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <TableOfFilms Films={filmList} deleteFilm={deleteFilm} editFilm={editFilm} />
        </Col>
      </Row>
    </>
  );
}
function FilmFormRoute({ addFilm, editFilm, filmList }) {
  const { filmId } = useParams();
  const navigate = useNavigate();

  // If we are editing, the film is looked up from filmList.
  const filmToEdit = filmList && filmId
      ? filmList.find((film) => film.id.toString() === filmId)
      : null;

  // Wrap handlers so that after adding or editing we navigate back
  function handleAddFilm(newFilm) {
    addFilm(newFilm);
    navigate("/");
  }

  function handleEditFilm(updatedFilm) {
    editFilm(updatedFilm);
    navigate("/");
  }

  return (
    <FormComponent
      addFilm={addFilm ? handleAddFilm : undefined}
      editFilm={editFilm ? handleEditFilm : undefined}
      filmToEdit={filmToEdit}
      toggleForm={() => navigate("/")}
    />
  );
}

function DefaultRoute() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}

export default App
