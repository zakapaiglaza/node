import MovieModels from '../schema/movie_models';
import RedisClient from '../dbSetting/redis';
import Joi from 'joi';
import { Request, Response } from 'express';
import Movie from '../interface/interface';



class MovieController {
    private MovieSchema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string(),
        date: Joi.string(),
    });


    private memoryCache = new Map<string, { data: Movie; expiration: number }>();
    private memoryCacheTTL = 15 * 1000;


    private ongoingRequests = new Map<string, Promise<Movie | null>>();

 
    private mapToMovie(movieModel: MovieModels): Movie {
        return {
            id: movieModel.id,
            title: movieModel.title,
            description: movieModel.description,
            date: movieModel.date,
            createdAt: movieModel.createdAt,
            updatedAt: movieModel.updatedAt,
        };
    }

    async createMovie(req: Request, res: Response) {
        const { error } = this.MovieSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: 'invalid data' });
        }

        try {
            const movie = await MovieModels.create(req.body);
            return res.status(200).json(this.mapToMovie(movie));
        } catch (err) {
            return res.status(500).json({ message: 'error create movie', error: err });
        }
    }

    async getMovieByTitle(req: Request, res: Response) {
        const { title } = req.params;

  
        const memoryData = this.memoryCache.get(title);
        if (memoryData && memoryData.expiration > Date.now()) {
            console.log('from node memory cache');
            return res.status(200).json(memoryData.data);
        }

        try {
            const cachedMovie = await RedisClient.get(title);
            if (cachedMovie) {
                console.log('from redis');
                const movieData: Movie = JSON.parse(cachedMovie);
                
                this.memoryCache.set(title, { data: movieData, expiration: Date.now() + this.memoryCacheTTL });
                return res.status(200).json(movieData);
            }
        } catch (error) {
            console.error('redis error:', error);
        }

        
        if (this.ongoingRequests.has(title)) {
           
            return this.ongoingRequests.get(title)!.then(movie => {
                if (movie) {
                    return res.status(200).json(movie);
                } else {
                    return res.status(404).json({ message: 'movie not found' });
                }
            }).catch(err => {
                return res.status(500).json({ message: 'error while receiving', error: err });
            });
        }

        
        const requestPromise = (async () => {
            try {
                const movieModel = await MovieModels.findOne({ where: { title } });
                if (!movieModel) {
                    return null;
                }

                const movie = this.mapToMovie(movieModel);

                
                await RedisClient.setex(title, 30, JSON.stringify(movie));

                
                this.memoryCache.set(title, { data: movie, expiration: Date.now() + this.memoryCacheTTL });

                return movie;
            } catch (err) {
                throw new Error('error while receiving');
            }
        })();

        
        this.ongoingRequests.set(title, requestPromise);

        
        requestPromise.finally(() => {
            this.ongoingRequests.delete(title);
        });


        return requestPromise.then(movie => {
            if (movie) {
                return res.status(200).json(movie);
            } else {
                return res.status(404).json({ message: 'Movie not found' });
            }
        }).catch(err => {
            return res.status(500).json({ message: 'error while receiving', error: err });
        });
    }
}

export default new MovieController();
