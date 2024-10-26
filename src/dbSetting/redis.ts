import { createClient, RedisClientType } from 'redis';
import Config from './db_config';

class RedisClient {
    private client: RedisClientType;

    constructor() {
        this.client = createClient({
            socket: {
                host: Config.RedisConfig.host,
                port: Config.RedisConfig.port,
            },
        });

        this.client.on('error', (err) => {
            console.error('error Redis Client', err);
        });

        this.client.connect().catch((err) => console.error('Failed to connect Redis:', err));
    }

    async get(key: string): Promise<string | null> {
        try {
            return await this.client.get(key);
        } catch (err) {
            console.error('error getting value from redis:', err);
            throw err;
        }
    }

    async setex(key: string, seconds: number, value: string): Promise<void> {
        try {
            await this.client.setEx(key, seconds, value);
        } catch (err) {
            console.error('error setting value in rdis:', err);
            throw err;
        }
    }
}

export default new RedisClient();
