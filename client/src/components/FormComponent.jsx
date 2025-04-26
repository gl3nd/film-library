import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import dayjs from 'dayjs';
import API from '../API.js';
import {useNavigate, useParams} from 'react-router-dom'


function FormComponent({ addFilm ,filmToEdit, editFilm,toggleForm}) {
  const [title, setTitle] = useState(filmToEdit?.title || '');
  const [favorite, setFavorite] = useState(filmToEdit?.favorite || false);
  const [watchDate, setWatchDate] = useState(filmToEdit?.watchDate ? dayjs(filmToEdit.watchDate).format('YYYY-MM-DD') :"");
  const [rating, setRating] = useState(filmToEdit?.rating || 0);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title) {
      alert('Please enter a title for the film!');
      return;
    }

    const newFilm = {
      title: title,
      favorite: favorite,
      watchDate: watchDate ? dayjs(watchDate).format('YYYY-MM-DD') : null,
      rating: parseInt(rating) || 0,
    };
  
    const updatedFilm = filmToEdit ?{
      id: filmToEdit.id,
      title: title,
      favorite: favorite,
      watchDate: watchDate ? dayjs(watchDate).format('YYYY-MM-DD') : null,
      rating: parseInt(rating) || 0,
    }: null;

    console.log(filmToEdit);
    if(filmToEdit !==null){//Not implemented yet
      //API.editFilm(newFilm).then(()=> {console.log("Film updated")}).catch(e=>console.log(e));
      editFilm(updatedFilm);
      toggleForm();
    }else{
        API.addNewFilm(newFilm)
        .then(f=>addFilm(f)).catch(err=>console.log(err));
        toggleForm();
    }
    clearForm();
    navigate("../filter/all")
    
  };

  const clearForm = () => {
    setTitle('');
    setFavorite(false);
    setWatchDate('');
    setRating(0);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formTitle" style={{marginTop:'30px'}}>
        <Form.Label>Film Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter film title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formFavorite">
        <Form.Check
          type="checkbox"
          label="Mark as Favorite"
          checked={favorite}
          onChange={(e) => setFavorite(e.target.checked)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formWatchDate">
        <Form.Label>Watch Date</Form.Label>
        <Form.Control
          type="date"
          value={watchDate}
          onChange={(e) => setWatchDate(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formRating">
        <Form.Label>Rating</Form.Label>
        <Form.Control
          type="number"
          placeholder="Rate from 1 to 5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          min="0"
          max="5"
        />
      </Form.Group>

      <Button variant="primary" type="submit"> 
      {filmToEdit ? 'Save Changes' : 'Add Film'}
        </Button>
      <Button
      variant="danger"
      onClick={toggleForm}
      className="ms-3"
    >
      Close Form
    </Button>
    </Form>
    
  );
}



export default FormComponent;
