import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';


function AddFilmButton({ showForm, toggleForm }) {
  return (
    <i 
      className="bi bi-plus-square"
      style={{ fontSize: "30px", textAlign: 'right', marginRight: '27px', cursor: "pointer" }} 
      onClick={toggleForm}  
      alt="Show add film form"
    >

 
    </i>
  );
}

export default AddFilmButton;
