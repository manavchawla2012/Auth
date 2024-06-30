import redisClient, {prepareCacheKey} from "@utils/redisClient";

class CacheHelper {
    static set = async (key: string, value: string, options?: { EX: number }) => {
        await redisClient.set(prepareCacheKey(key), value, options);
    };

    static get = async (key: string): Promise<string | null> => {
        return await redisClient.get(prepareCacheKey(key));
    };

    static del = async (key: string): Promise<number> => {
        return await redisClient.del(prepareCacheKey(key));
    };

    static sadd = async (key: string, value: string) => {
        await redisClient.sAdd(prepareCacheKey(key), value);
    };

    static srem = async (key: string, value: string) => {
        await redisClient.sRem(prepareCacheKey(key), value);
    };

    static smembers = async (key: string): Promise<string[]> => {
        return await redisClient.sMembers(prepareCacheKey(key));
    };

    static keys = async (patternKey: string): Promise<string[]> => {
        return await redisClient.keys(prepareCacheKey(patternKey));
    };

    static deleteAllByPattern = async (patternKey: string): Promise<number> => {
        const keys = await this.keys(patternKey)
        keys.map((key ) => {
            redisClient.del(key)
        });
        return keys.length
    }
}

export default CacheHelper