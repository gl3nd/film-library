import 'bootstrap/dist/css/bootstrap.min.css'
import {Form, Table} from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {BrowserRouter, Routes, Route, Outlet, Navigate, useNavigate, Link,useParams} from 'react-router-dom'

import dayjs from 'dayjs';



function StarRating({rating,onRatingChange}){
    return(
      <div className='star-rating'>
        {[... Array(5)].map((_,n)=>(
         <i key={n}
         className = {n<rating ? "bi bi-star-fill" :"bi bi-star"}
         onClick={() => onRatingChange(n + 1)}
         style={{ cursor: "pointer" }} />
        ))}
      </div>
    );
  }
  
function FilmRow({f, deleteFilm,editFilm}){
  
  const handleFavoriteChange = (e) => {
    const updateFilm = {...film,favorite : e.target.checked};
    editFilm(updateFilm);
  }
  
    // Update the film's rating when a star is clicked.
    const handleRatingChange = (newRating) => {
      const updatedFilm = { ...film, rating: newRating };
      editFilm(updatedFilm);
    };
    const navigate = useNavigate()
    const film = f
  
    return(
      <tr>
        <th scope="row">{film.title}</th>
        <td><Form>
      {['checkbox'].map((type) => (
        <div key={`default-${type}`} className="mb-3">
          <Form.Check // prettier-ignore
            id={`default-${film.id}`}
            defaultChecked={film.favorite}
            onClick={handleFavoriteChange}
            //label={`default ${type}`}
          />
        </div>
      ))}
      </Form>
            </td>
        <td>{film.watchDate ? dayjs(film.watchDate).format("DD-MMMM-YY") : ''}</td>
        <td>
          <StarRating rating={film.rating} onRatingChange={handleRatingChange}/>
        </td>
        <td>
          <div className='d-inline-block align-top'>
            <i 
              onClick={() => { deleteFilm(film.id)}}
              className="bi bi-trash3 d-inline-block align-top"
              alt="DeleteLogo"
              style={{fontSize: "20px" , cursor: "pointer" }} />
            <i
              onClick={()=>{
                navigate(`/edit/${film.id}`);
                console.log('Clicked')
              }} 
              className="bi bi-pencil-square d-inline-block align-top"
              style={{ fontSize: "20px", textAlign: 'right', marginLeft:"20px", cursor: "pointer" }}
            ></i></div>
        </td>
      </tr>
      
    )
  }
  
  function TableOfFilms({Films,deleteFilm,editFilm}) {
  
    return (
      <Table hover>
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Favorite</th>
            <th scope="col">Last Seen</th>
            <th scope="col">Rating</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {Films.map(e=><FilmRow key={e.id} f={e} deleteFilm={deleteFilm}  editFilm={editFilm}/>)}
        </tbody>
      </Table>
    ) 
  }

export default TableOfFilms;