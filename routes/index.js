const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/moviesController');

// Главная страница
router.get('/', (req, res) => {
  res.render('index', { movies: moviesController.getMovies() });
});

// Страница добавления фильма
router.get('/add', (req, res) => {
  res.render('add');
});

// Обработка добавления фильма
router.post('/add', (req, res) => {
  moviesController.addMovie(req.body.title, req.body.genre, req.body.year);
  res.redirect('/');
});

// Страница редактирования фильма
router.get('/edit/:id', (req, res) => {
  const movie = moviesController.findMovieById(parseInt(req.params.id));
  if (movie) {
    res.render('edit', { movie: movie });
  } else {
    res.status(404).send('Film nie znaleziony');
  }
});

// Обработка редактирования фильма
router.post('/edit/:id', (req, res) => {
  moviesController.updateMovie(parseInt(req.params.id), req.body.title, req.body.genre, req.body.year);
  res.redirect('/');
});

// Удаление фильма
router.get('/delete/:id', (req, res) => {
  moviesController.deleteMovie(parseInt(req.params.id));
  res.redirect('/');
});

// Страница отчета
router.get('/report', (req, res) => {
  const reportData = moviesController.getMovieReport();
  res.render('report', { movies: reportData });
});

module.exports = router;