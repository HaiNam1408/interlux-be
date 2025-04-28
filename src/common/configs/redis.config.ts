import KeyvRedis from "@keyv/redis";
import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";

export const RedisOptions: CacheModuleAsyncOptions = {
    isGlobal: true,
    useFactory: () => ({
        stores: [
            new KeyvRedis(`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`),
        ],
    }),
};