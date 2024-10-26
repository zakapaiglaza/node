import express from 'express';
import MovieController from '../controller/movie_controller';

const router = express.Router();

router.post('/movie', (req, res) => { MovieController.createMovie(req, res) });

router.get('/movie/:title', (req, res) => { MovieController.getMovieByTitle(req, res) });

export default router;
