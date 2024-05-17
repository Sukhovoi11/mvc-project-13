const path = require('path');
const Movie = require('../models/movie');
const fs = require('fs');
const DATA_FILE = path.join(__dirname, '../data/movies.json');

let movies = loadMovies();
let availableIds = [];
let nextId = movies.length ? movies[movies.length - 1].id + 1 : 1;

function loadMovies() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            fs.writeFileSync(DATA_FILE, JSON.stringify([]));
            return [];
        }
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data || '[]');
    } catch (error) {
        console.error("Could not load movies:", error);
        return [];
    }
}

function saveMovies(movies) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(movies, null, 2));
    } catch (error) {
        console.error("Could not save movies:", error);
    }
}

function addMovie(title, genre, year) {
    let id;
    if (availableIds.length > 0) {
        id = availableIds.shift();
    } else {
        id = nextId++;
    }
    const movie = new Movie(id, title, genre, year);
    movies.push(movie);
    saveMovies(movies);
}

function getMovies() {
    return movies;
}

function findMovieById(id) {
    return movies.find(movie => movie.id === id);
}

function updateMovie(id, title, genre, year) {
    const movie = findMovieById(id);
    if (movie) {
        movie.title = title;
        movie.genre = genre;
        movie.year = year;
    }
}

function deleteMovie(id) {
    const index = movies.findIndex(movie => movie.id === id);
    if (index === -1) return;

    movies.splice(index, 1);

    if (index < movies.length) {
        movies[index].id = id;
        for (let i = index; i < movies.length; i++) {
            movies[i].id = i + 1;
        }
        nextId = movies.length + 1;
    } else {
        nextId = id;
    }
    saveMovies(movies);
}

function getMovieReport() {
    let reportData = {};
    movies.forEach(movie => {
        if (reportData[movie.genre]) {
            reportData[movie.genre] += 1;
        } else {
            reportData[movie.genre] = 1;
        }
    });
    return reportData;
}

module.exports = {
    addMovie,
    getMovies,
    updateMovie,
    deleteMovie,
    getMovieReport,
    findMovieById,
    saveMovies,
    loadMovies
};
