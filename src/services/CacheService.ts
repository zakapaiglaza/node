import { CacheInterface, Movie } from '../interface/MovieInterface';
import RedisClient from '../Config/RedisClient';
import RedisService from './RedisService';

class CacheService {
    private nodeCache = new Map<string, CacheInterface>();
    private nodeCacheSeconds = 15 * 1000; 

    async getCache(key: string): Promise<Movie | null> {

        const cacheData = this.nodeCache.get(key);
        if (cacheData && cacheData.expiration > Date.now()) {
            console.log(`found in node cache: ${JSON.stringify(cacheData.data)}`);
            return cacheData.data;
        }


        const redisData = await RedisClient.get(key);
        if (redisData) {
            const movie: Movie = JSON.parse(redisData);
            console.log(`found in redis: ${JSON.stringify(movie)}`);
            this.setCache(key, movie);
            return movie;
        }
        
        return null;
    }


    async setCache(key: string, data: Movie): Promise<void> {
 
        this.nodeCache.set(key, { data, expiration: this.nodeCacheSeconds });

        await RedisService.setMovie(key,30,JSON.stringify(data))
    }

}

export default new CacheService();


