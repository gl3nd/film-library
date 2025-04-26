import dayjs from 'dayjs';

//{ id: 1, title: "Pulp Fiction", favorite: true, watchDate: dayjs("2023-03-10"), rating: 5 },

function Film(id, title, isFavorite, watchDate, rating) {
    this.id = id;
    this.title = title;
    this.favorite = isFavorite;
    this.rating = rating;
    this.watchDate = watchDate ? dayjs(watchDate) : null; // saved as dayjs object only if watchDate is truthy
}

const url = "http://localhost:3000/api"

async function getFilms() {
    //Call API to get films 
    const response = await fetch(url+`/films`,{
        credentials: 'include'
    });
    const listFilm = await response.json();
    if(response.ok){
        return listFilm.map(f => new Film(f.id,f.title,f.favorite,f.watchDate,f.rating))
    }else{
        throw listFilm;
    }

}

async function getFilteredFilms(filter) {
    //Call API to get films that match optional filter in the query
    const response = await fetch(url+`/films?filter=${filter}`,{
        credentials: 'include'
    });
    const listFilm = await response.json();
    if(response.ok){
        return listFilm.map(f => new Film(f.id,f.title,f.favorite,f.watchDate,f.rating))
    }else{
        throw listFilm;
    }

}

async function addNewFilm(film) {
    console.log(film);
    console.log(JSON.parse(JSON.stringify(film)).title);
    return fetch(url+'/films/',{
        method: 'POST',
        headers : {
            'Content-Type' : 'application/json',
        },
        credentials : 'include',
        body : JSON.stringify({
            "title": film.title,
            "favorite": film.favorite,
            "watchDate": film.watchDate,
            "rating": film.rating
        })
    }) .then(response => response.json())
    .catch(error => console.error('Error:', error));
}

async function deleteFilm(filmId) {
    return fetch(url+`/films/${filmId}`,{
        method: 'DELETE',
        credentials : 'include',
    })//.then(response=>response.json()).catch(err=>console.log(err));
}
async function editFilm(film) {
    console.log(JSON.parse(JSON.stringify(film)).title);
    return fetch(url+`/films/${film.id}`,{
        method: 'PUT',
        headers : {
            'Content-Type' : 'application/json',
        },
        credentials: 'include',
        body : JSON.stringify({
            "title": film.title,
            "favorite": film.favorite,
            "watchDate": film.watchDate,
            "rating": film.rating
        })
    }) .then(r=>{
        if(!r.ok){throw new Error("FAiled to edit movie")}
        else{return r.json()}
    })
    .catch(error => console.error('Error:', error));
}

async function searchFilm(title) {
    const response = await fetch(url+`searchFilm?title=${encodeURIComponent(title)}`,{
        credentials: 'include'
    });
    const listFilm = await response.json();
    if(response.ok){
        return listFilm.map(f => new Film(f.id,f.title,f.favorite,f.watchDate,f.rating))
    }else{
        throw listFilm;
    }
}

async function logIn(user) {
    try {
        const response = await fetch(url + '/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(user),
        });
        if (!response.ok) throw new Error('Login failed');
        console.log(`User ${user.email} logged in successfully`);
        return await response.json();
    } catch (error) {
        console.error('Login error:', error);
    }

    
}

async function getUserInfo() {
    try{
        const response = await fetch(url+`/sessions/current`,{
            credentials: 'include',
        });
        if(!response.ok){
            return undefined;
        }
        const user = await response.json();
        if(!user || !user.email) throw new Error("User DAta is missing");
        console.log(`User ${user.email} found`);
        return user;
    }catch(error){
        console.error('Getting user error:',error);
    }
   
}

async function logOut(user) {
    try{
    const response = await fetch(url+`/sessions/current`,{
        method: 'DELETE',
        credentials: 'include',
    })
    if(!response.ok){
        throw new Error("Log out Failed")
    }
        console.log("LogedOut Succesfully")
    }
    catch(e){
        console.error("Erorr while logging out", e)
    }
}

const API = {getFilms,getFilteredFilms,addNewFilm,deleteFilm,editFilm,logIn,getUserInfo,logOut};

export default API