import RedisClient from '../Config/RedisClient';


class RedisService {
    async getMovie(key: string): Promise<string | null> {
        return await RedisClient.get(key);
    }

    async setMovie(key: string,seconds:number,value: string): Promise<void> {
        await RedisClient.setex(key, seconds, value);
    }
}

export default new RedisService();