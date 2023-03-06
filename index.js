'use strict'
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const pg = require('pg');//importing pg library
const { request } = require('express');
const index = express();
index.use(express.json());
index.use(cors());
index.use(express.json());
const PORT = process.env.PORT || 3000;
const client = new pg.Client(process.env.DATABASE_URL);


//////ROUTES//////:
index.get('/', home);
index.get('/favorite', favorite);
index.get('/trending', trending);
index.get('/search', search);
index.get('/popular', popular);
index.get('/top_rated', topRated);
index.get('/allmovies', getAllMovies)
index.post('/addmovies', addAllMovies)
index.delete('/deletemovie/:id',deleteAllMovies)
index.put('/updatemovie/:id',updateAllMovies)
index.get('/allmovies/:id', getAllMoviesById)
index.get('*', defaultHandler);
index.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500);
    res.send('500 Server Error');
});


//////Functions Handlers/////
function home(req, res) {
    const data = require('./Movie Data/data.json')
    function movies(obj) {
        return {
            title: obj.title,
            poster_path: obj.poster_path,
            overview: obj.overview,
        };
    }
    const movieData = movies(data);
    res.status(200).send(movieData);
};

function favorite(req, res) {
    let welcome = 'Welcome to Favorite Page';
    res.status(200).send(welcome);
};

function trending(req, res) {
    //send a request to the API:
    const APIKey = process.env.APIKey;
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${APIKey}`;
    axios.get(url)
        // res.send(axiosRes.data);
        .then((result) => {
            function trendingMovies(obj) {
                let trending = [];
                for (let i = 0; i < obj.results.length; i++) {
                    trending.push({
                        id: obj.results[i].id,
                        title: obj.results[i].name,
                        release_date: obj.results[i].first_air_date,
                        poster_path: obj.results[i].poster_path,
                        overview: obj.results[i].overview,
                    });
                }
                return trending;
            }
            const movieData = trendingMovies(result.data);
            res.status(200).send(movieData);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
};


function search(req, res) {
    const APIKey = process.env.APIKey;
    const mov = req.query.name;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&query=${mov}&page=2`;
    axios.get(url)
    .then((result) => {
        function searchMovies(obj) {
            let search = [];
            for (let i = 0; i < obj.results.length; i++) {
                search.push({
                    id: obj.results[i].id,
                    title: obj.results[i].original_title,
                    release_date: obj.results[i].release_date,
                    poster_path: obj.results[i].poster_path,
                    overview: obj.results[i].overview,
                });
            }
            return search;
        }
        const movieData = searchMovies(result.data);
        res.status(200).send(movieData);
    })
    .catch((err) => {
        res.status(500).send(err);
    });
};

function popular(req, res) {
    const APIKey = process.env.APIKey;
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${APIKey}&language=en-US&page=1`;
    axios.get(url)
    .then((result) => {
        function popularMovies(obj) {
            let popular = [];
            for (let i = 0; i < obj.results.length; i++) {
                popular.push({
                    id: obj.results[i].id,
                    title: obj.results[i].original_title,
                    release_date: obj.results[i].release_date,
                    poster_path: obj.results[i].poster_path,
                    overview: obj.results[i].overview,
                });
            }
            return popular;
        }
        const movieData = popularMovies(result.data);
        res.status(200).send(movieData);
    })
    .catch((err) => {
        res.status(500).send(err);
    });
};

function topRated(req, res) {
    const APIKey = process.env.APIKey;
    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${APIKey}&language=en-US&page=1`;
    axios.get(url)
    .then((result) => {
        function topRatedMovies(obj) {
            let topRated = [];
            for (let i = 0; i < obj.results.length; i++) {
                topRated.push({
                    id: obj.results[i].id,
                    title: obj.results[i].original_title,
                    release_date: obj.results[i].release_date,
                    poster_path: obj.results[i].poster_path,
                    overview: obj.results[i].overview,
                });
            }
            return topRated;
        }
        const movieData = topRatedMovies(result.data);
        res.status(200).send(movieData);
    })
    .catch((err) => {
        res.status(500).send(err);
    });
};

function getAllMovies(req,res) {
    //return allMovies table content
    const sql = 'SELECT * FROM allmovies;'
    client.query(sql)
    .then ((data)=>{
        res.send(data.rows);

    })
    .catch((err) => {
        res.status(500).send(err);
    });
};

function  addAllMovies(req,res) {
    const movie = req.body; 
    console.log(movie);
    const sql = `INSERT INTO allmovies (title,release_date,poster_path,overview) VALUES ($1,$2,$3,$4) RETURNING *;`
    const values = [movie.title, movie.release_date, movie.poster_path, movie.overview];
    console.log(sql);

    client.query(sql,values)
    .then((data) => {
        res.status(200).send(data.rows);
    })
    .catch((err) => {
        res.status(500).send(err);
    });
}

function deleteAllMovies(req,res) {
    //delete some data from the database
    const id = req.params.id;
    const sql = `DELETE FROM allmovies WHERE id=${id}`;
    client.query(sql)
    .then((data)=>{
        res.status(204);
        res.send(data.rows);
    })
    .catch((err) => {
        res.status(500).send(err);
    });

}

function updateAllMovies(req,res) {
    const id = req.params.id;
    console.log(req.body);
    console.log(id);
    const sql = `UPDATE allmovies SET title=$1, release_date=$2, poster_path=$3, overview=$4 WHERE id=${id} RETURNING *`;
    const values = [req.body.title,req.body.release_date,req.body.poster_path,req.body.overview];
    client.query(sql,values)
    .then((data)=>{
        res.status(200).send(data.rows);
    })
    .catch((err) => {
        res.status(500).send(err);
    });
}

function getAllMoviesById(req,res) {
    const id = req.params.id;
    const sql = `SELECT * FROM allmovies WHERE id=${id};`
    client.query(sql)
    .then ((data)=>{
        res.send(data.rows);

    })
    .catch((err) => {
        res.status(500).send(err);
    });
}

function defaultHandler(req, res) {
    console.log('404 Not Found');
    res.status(404);
    res.send('404 Not Found');
};

//connect the server with the DataBase:
client.connect()
.then (() => {
    index.listen(PORT, () => {
        console.log(`Listening on ${PORT}: I am ready`)
    })
})


