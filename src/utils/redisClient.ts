import {createClient} from 'redis';
import * as process from "node:process";

const redisClient = createClient({
    url: process.env.REDIS_URL,
    database: process.env.REDIS_DATABASE as unknown as number,
    password: process.env.REDIS_PASSWORD,

    // Adjust the URL if Redis is running on a different host/port
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
    await redisClient.connect();
})();

export const prepareCacheKey = (key: string): string => `auth:${key}`;

export default redisClient;