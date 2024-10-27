import MovieModels from '../schema/MovieModels';
import CacheService from './CacheService';
import RedisService from './RedisService';
import { Movie } from '../interface/MovieInterface';


class MovieService {
    private currentRequests = new Map<string, Promise<Movie | null>>();

    async createMovie(data: Movie): Promise<Movie> {
        return await MovieModels.create(data);
    }

    async getMovieTitle(title: string): Promise<Movie | null> {
      
        const cacheMovie = await CacheService.getCache(title);
        
        if (cacheMovie) {
            console.log(`Movie fetched from in-memory cache: ${JSON.stringify(cacheMovie)}`);

            return cacheMovie;
        }
    
   
        const redisMovie = await RedisService.getMovie(title);
        if (redisMovie) {
            const movieData: Movie = JSON.parse(redisMovie);
            console.log(`movie fetched from Redis cache: ${JSON.stringify(movieData)}`);
            CacheService.setCache(title, movieData);
            return movieData;
        }
    
        if (this.currentRequests.has(title)) {
            return this.currentRequests.get(title)!;
        }
    
        const requestPromise = (async (): Promise<Movie | null> => {
            const movieModel = await MovieModels.findOne({ where: { title } });
            if (!movieModel) {
                console.log(`movie not found in database for title: ${title}`);

                return null;
            }
    
            const movie: Movie = {
                id: movieModel.id,
                title: movieModel.title,
                description: movieModel.description,
                date: movieModel.date,
                createdAt: movieModel.createdAt,
                updatedAt: movieModel.updatedAt
            };
    
   
            await RedisService.setMovie(title,30 ,JSON.stringify(movie));
            console.log(`Movie stored in cache: ${JSON.stringify(movie)}`);

            CacheService.setCache(title, movie);
    
            return movie;
        })();
    
        this.currentRequests.set(title, requestPromise);
        requestPromise.finally(() => {
            this.currentRequests.delete(title);
        });
    
        return requestPromise;
    }
    
}

export default new MovieService();