import { createClient } from 'redis';

let redis;

export async function initRedis() {
    try {
        const REDIS_HOST = process.env.REDIS_HOST || 'redis';
        const REDIS_PORT = (process.env.REDIS_PORT || 6379) as number;

        redis = createClient({
            url: `redis://${REDIS_HOST}:${REDIS_PORT}`
        });

        redis.on('error', (err) => console.log('Redis Client Error', err));

        redis.on('connect', () => console.log('Redis is Ready'));

        redis.connect();
    }catch(e) {
        throw new Error(`Error while init redis ${e}`);
    }
}

export async function putToCache(key, value) {
    if (!redis) {
        throw new Error('Redis is not defined');
    }

    try {
        await redis.set(key, JSON.stringify(value));
    } catch(e) {
        console.log('putToCache error', e);
    }
}

export async function getFromCache(key: string) {
    if (!redis) {
        throw new Error('Redis is not defined');
    }

    try {
        return JSON.parse(await redis.get(key));
    } catch(e) {
        console.log('putToCache error ', e);
    }
}

export function getRedisClient() {
    if (!redis) {
        throw new Error('Redis is not initialized');
    }

    return redis;
}
