import dotenv from 'dotenv';

dotenv.config();

class Config {
    static get DBconfig() {
        return {
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 5432,
            username: process.env.DB_USERNAME || 'root',
            pass: process.env.DB_PASS || '1',
            db: process.env.DB_NAME || 'node-test'
        };
    }

    static get RedisConfig() {
        return {
            host: process.env.REDIS_HOST || 'localhost',
            port: Number(process.env.REDIS_PORT) || 6379,
        };
    }
}

export default Config;
