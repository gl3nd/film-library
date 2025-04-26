'use strict';
const express = require('express'); 
const morgan = require('morgan');
const {check,validationResult,body,} = require('express-validator');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors')

const dao = require('./dao.js');
const user_dao = require('./dao-user.js');

const app = express();

const corsOptions={
    origin: 'http://localhost:5173',
    credentials: true,
};

//Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions)); 


//Config Session
app.use(session({
    secret: "Don't tell anyone!",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: app.get('env') === 'production', sameSite: 'lax' },
}));

app.use(passport.initialize());
app.use(passport.session());

//Config passport
const LocalStrategy = require('passport-local');
passport.use(new LocalStrategy({ usernameField: 'email' }, async function(username,password,callback) {
    const user = await user_dao.getUser(username,password);
    if(!user){
        return callback(null,false,"Incorrect username or password");
    }
    return callback(null,user);
}));


passport.serializeUser(function(user,callback){
    callback(null,user.id);
});

passport.deserializeUser(async (id,callback) => {
    try {
        const u = await user_dao.getUserById(id);
        console.log("Deserialized user:", u);
        callback(null, u);
    } catch (err) {
        console.error("Deserialize error:", err);
        callback(err, null);
    }
});


const isLoggedIn = (req,res,next) =>{
    if(req.isAuthenticated()){
        return next();
    }
    return res.status(400).json({error:"Not authenticated"});
}


const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return `${location}[${param}]: ${msg}`;
};

app.get('/api/films', isLoggedIn,
    (req, res) => {
      // get films that match optional filter in the query
      dao.listFilms(req.user.id,req.query.filter)
        .then(films => res.json(films))
        .catch((err) => res.status(500).json(err)); // always return a json and an error message
    }
);

app.get('/api/films/:id',isLoggedIn,[ check('id').isInt({min: 1}) ],async (req,res)=>{
    try{
    const result = await dao.getFilm(req.user.id,req.params.id);
        if(result.error)
            res.status(404).json(result);
        else
            res.json(result);
    }catch (err){
        res.status(500).end();
    }
}
);

app.post('/api/films',async (req,res)=>{
    const film = {
        title: req.body.title,
        favorite: req.body.favorite,
        watchDate: req.body.watchDate,
        rating: req.body.rating,
        user: req.user.id //Add user to film

    }
    try {
        const newId = await dao.addFilm(film);
        res.status(201).json({id: newId});
    }catch (err){
        res.status(500).json({error: 'Database error during insertion'});
    }
})

app.post('/api/films/:id/favorite',async(req,res)=>{
    
    const film = {
        id: req.body.id,
        favorite: req.body.favorite
    }
    console.log(film.id);
    console.log(film.favorite);

    try {
        const updatedFilm = await dao.markFilm(film.id,film.favorite);
        res.status(200).json(updatedFilm);
    }catch(err){
        res.status(500).json({error: 'Database error during update'});
    }
})

app.post('/api/films/:id/rating',async(req,res)=>{
    const film = {
        id: req.body.id,
        deltaRating: req.body.deltaRating
    }
    try{
        const updatedFilm = await dao.changeRating(film.id,film.deltaRating);
        res.status(200).json(updatedFilm);
    }catch(err){
        res.status(500).json({error: 'Darabase error during the update of rating'});
    }
})

app.delete('/api/films/:id',isLoggedIn,async(req,res)=>{
    const currId = req.params.id;
    try{
        await dao.deleteFilm(req.user.id,currId);
        res.status(200).end()
    }catch(err){
        res.status(500).json({error:`Error deleting film with id ${currId}`})
    }
})

app.put('/api/films/:id', isLoggedIn, async(req,res)=>{
    const filmID = req.params.id;
    
    const userId = req.user.id
    try{
        const film = await dao.getFilm(userId,filmID)

        if(!film){
            return res.status(404).json({error:"Film not found or unauthorized"});
        }
    const filmToBeUpdated = {
            title: req.body.title !== undefined ? req.body.title : film.title,
            // Check explicitly if favorite is undefined
            favorite: req.body.favorite !== undefined ? req.body.favorite : film.favorite,
            watchDate: req.body.watchDate !== undefined ? req.body.watchDate : film.watchDate,
            rating: req.body.rating !== undefined ? req.body.rating : film.rating,
        };
    
        const updatedFilm = await dao.updateFilm(userId,filmID,filmToBeUpdated);
        res.status(200).json({sucess: "Film updated Successfully", id: filmID,});
    }catch(err){
        res.status.json({error: `Error updating film with id ${filmID}`});
    }
})
//Search

app.get('/api/searchFilm', isLoggedIn,
    (req, res) => {
      // get films that match optional filter in the query
      dao.searchFilm(req.user.id,req.query.title)
        .then(films => res.json(films))
        .catch((err) => res.status(500).json(err)); // always return a json and an error message
    }
);




//User api

// POST /api/sessions 
// This route is used for performing login.
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => { 
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json({ error: info});
      }
      // success, perform the login and extablish a login session
      req.login(user, (err) => {
        if (err){
            console.error("Session creatin error",err)
            return next(err);
        }
        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUser() in LocalStratecy Verify Fn
        return res.json(user);
      });
  })(req, res, next);
});

// GET /api/sessions/current
// This route checks whether the user is logged in or not.
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current
// This route is used for loggin out the current user.
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.status(200).json({});
  });
});


app.listen(3000 ,()=>console.log('Server Ready'));
