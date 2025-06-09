import KeyvRedis from "@keyv/redis";
import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";

export const RedisOptions: CacheModuleAsyncOptions = {
    isGlobal: true,
    useFactory: () => ({
        ttl: Number(process.env.REDIS_TTL) || 1000 * 60 * 5,
        stores: [
            new KeyvRedis(`redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`),
        ],
    }),
};