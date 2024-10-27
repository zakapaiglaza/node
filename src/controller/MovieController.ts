import { Request, Response } from 'express';
import MovieService from '../services/MovieService';
import ValidationService from '../services/ValidationService';
import { MovieValidation } from '../interface/MovieInterface';

class MovieController {
    
    async getMovieByTitle(req: Request, res: Response): Promise<void> {
        const title = req.params.title;
    
        try {
            const movie = await MovieService.getMovieTitle(title);
            if (!movie) {
                res.status(404).json({ error: "movie not found" });
                return;
            }
    
            res.json(movie);
        } catch (error) {
            console.error('err fetching movie:', error);
            res.status(500).json({ message: 'err server' });
        }
    }


    async createMovie(req: Request, res: Response): Promise<Response> {
        const movieData: MovieValidation = req.body;

        const { error } = ValidationService.validateMovie(movieData);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        try {
            
            const newMovie = await MovieService.createMovie(movieData);
            return res.status(201).json(newMovie);
        } catch (error) {
            console.error('error creating movie:', error);
            return res.status(500).json({ message: 'err server' });
        }
    }
    
}

export default new MovieController();