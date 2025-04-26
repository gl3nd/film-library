"use strict";
//CHANGED THIS ADDED USER =>error
const sqlite = require('sqlite3');
/// Import DOMPurify to sanitize title
const createDOMPurify = require('dompurify');
const {JSDOM} = require('jsdom');
const dayjs = require('dayjs');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// open the database
const db = new sqlite.Database('films_users.db', (err) => {
    if (err) throw err;
});

const convertFilmFromDbRecord = (dbRecord) => {
    const film = {};
    film.id = dbRecord.id;
    film.title = DOMPurify.sanitize(dbRecord.title); //Sanitaze title
    film.favorite = dbRecord.favorite;
    // Note that the column name is all lowercase, JSON object requires camelCase as per the API specifications we defined.
    // We convert "watchdate" to the camelCase version ("watchDate").


    // FIXME
    // Also, here you decide how to transmit an empty date in JSON. We decided to use the empty string.
    // Using the null value is an alternative, but the API documentation must be updated and the client must be modified accordingly.
    //film.watchDate = dbRecord.watchdate ? dayjs(dbRecord.watchdate) : "";
    film.watchDate = dbRecord.watchdate ? dayjs(dbRecord.watchdate) : null;
    film.rating = dbRecord.rating;

    /* // ALTERNATIVE:
    // WARNING: the column names in the database are all lowercases. JSON object requires camelCase as per the API specifications we defined.
    // We convert "watchdate" to the camelCase version ("watchDate").
    // Object.assign will copy all fields returned by the DB (i.e., all columns if SQL SELECT did not specify otherwise)
    const film = Object.assign({}, e, { watchDate: e.watchdate? dayjs(e.watchdate) : "" });  // adding camelcase "watchDate"
    delete film.watchdate;  // removing lowercase "watchdate"
    */
    return film;
}

const isSeenLastMonth = (film) => {
    if (film.watchDate) {  // Accessing watchDate only if defined
      const diff = dayjs().diff(film.watchDate,'month')
      console.log(diff);
      if(diff <= 1 ){
        return true;
      }
    }
    return false;
}

const filterValues = {
    'favorite':  { filterFunction: film => film.favorite },
    'best':      { filterFunction: film => film.rating >= 5 },
    'unseen':    { filterFunction: film => film.watchDate ? false : true },
    'all':       { filterFunction: film => true },
    'lastmonth': { filterFunction: film => isSeenLastMonth(film) },
};


exports.listFilms = (user,filter) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM films WHERE user=?';
        db.all(query, [user], (err, rows) => {
            if (err) {
                reject(err);
            }
            const films = rows.map(f => {
                const film = convertFilmFromDbRecord(f);
                //delete film.watchDate;
                return film;
            });
            if(filter){
                if(filterValues.hasOwnProperty(filter)){
                    resolve(films.filter(filterValues[filter].filterFunction));
                    return;
                }
            }
            resolve(films);

        })  
    });
}

exports.getFilm = (user,filmId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM films WHERE id=? AND user=?';
        db.get(query, [filmId,user], (err, row) => {
            if (err) { reject(err); }
            else if (!row ) {user
                resolve({ error: 'Film not FOUND!' });
            } else {
                const film = convertFilmFromDbRecord(row);
                resolve(film);
            }
        });
    });
};

exports.addFilm = (film) =>{
    return new Promise((resolve,reject)=>{
        const sql = 'INSERT INTO films (title,favorite,watchDate,rating,user) VALUES (?,?,?,?,?)';
        db.run(sql,[film.title,film.favorite,film.watchDate,film.rating,film.user],function(err){
            if(err) {reject(err);}
            else{
                resolve(exports.getFilm(film.user,this.lastID));
            }
        })
    })
}

exports.markFilm = (id,fav) => {
    return new Promise((resolve,reject)=>{
        const sql = 'UPDATE films SET favorite = ? WHERE id=?';
        db.run(sql,[fav,id],function (err){
            if(err){
                console.error('Database error during update:', err); // Log the SQL error
                reject(err);
            }
            else{
                resolve(exports.getFilm(id));
            }
        })
    })
}

exports.changeRating = (id,deltaRating) =>{
    return new Promise((resolve,reject)=>{
        const sql = 'UPDATE films SET rating=rating+? WHERE id=?';
        db.run(sql,[deltaRating,id],function(err){
            if(err){
                reject(err);
            }else{
                resolve(exports.getFilm(id));
            }
        })
    })
}

exports.deleteFilm = (user,id) =>{
    return new Promise((resolve,reject)=>{
        const sql = 'DELETE FROM films WHERE id = ? AND user=?';
        db.run(sql,[id,user],(err)=>{
            if(err){
                reject(err);
            }else{
                resolve(this.changes);
            }
        });
    });
};

exports.updateFilm = (user,id,film) =>{
    return new Promise((resolve,reject)=>{
        const sql = 'UPDATE films SET title=?, favorite=?, watchdate=?, rating=? WHERE id=? AND user=?';
        db.run(sql,[film.title,film.favorite,film.watchDate,film.rating,id,user],(err)=>
            {
            if(err){
                reject(err);
            }else{
                resolve({id: id});
            }
        });
    });
}

exports.searchFilm = (user,title) =>{
    return new Promise((resolve,reject)=>{
        const sql = "SELECT * FROM films WHERE user=? AND title LIKE ?"
        const titlePattern = `%${title}%`;
        db.all(sql,[user,titlePattern],(err,rows)=>{
            if(err){
                reject(err);
            }const films = rows.map(f => {
                const film = convertFilmFromDbRecord(f);
                //delete film.watchDate;
                return film;
            });
            resolve(films);
        })
    })
}