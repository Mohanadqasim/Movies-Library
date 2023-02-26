'use strict'
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const server = express();
server.use(cors());
const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Listening on ${PORT}: I am ready`)
})

//////ROUTES//////:
//home page:
server.get('/', homeHandler);
server.get('/favorite', favoriteHandler);
server.get('/trending', trendingHandler);
server.get('/search', searchHandler);
server.get('/popular', popularHandler);
server.get('/top_rated', topRatedHandler);
server.get('*', defaultHandler);
server.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500);
    res.send('500 Server Error');
});


//////Functions Handlers/////
function homeHandler(req, res) {
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

function favoriteHandler(req, res) {
    let welcome = 'Welcome to Favorite Page';
    res.status(200).send(welcome);
};

function trendingHandler(req, res) {
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


function searchHandler(req, res) {
    const APIKey = process.env.APIKey;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&query=boy&page=2`;
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
        })
};

function popularHandler(req, res) {
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
        })
};

function topRatedHandler(req, res) {
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
        })
};

function defaultHandler(req, res) {
    console.log('404 Not Found');
    res.status(404);
    res.send('404 Not Found');
};

