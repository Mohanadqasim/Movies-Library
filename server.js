'use strict'
const express = require('express');
const cors = require('cors');
const server = express();
server.use(cors());
const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Listening on ${PORT}: I am ready`)
})

//////ROUTES//////:
//home page:


server.get('/', (req, res) => {
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
});


//favorite:
server.get('/favorite', (req, res) => {
    let welcome = 'Welcome to Favorite Page';
    res.status(200).send(welcome);
})


//default route
server.get('*', (req, res) => {
    console.log('404 Not Found');
    res.status(404);
    res.send('404 Not Found');
})


//server error
server.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500);
    res.send('500 Server Error');
});