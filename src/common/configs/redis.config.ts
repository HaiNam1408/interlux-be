import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { redisStore } from "cache-manager-ioredis-yet";

export const RedisOptions: CacheModuleAsyncOptions = {
    isGlobal: true,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
            socket: {
                host: configService.get<string>("REDIS_HOST", "localhost"),
                port: configService.get<number>("REDIS_PORT", 6379),
            },
            ttl: configService.get<number>("REDIS_TTL", 60),
        });

        console.log("✅ Đã kết nối với Redis Store:", store);
        console.log("🚀 Redis Store đã khởi tạo:", store);
        return {
            store,
        };
    },
    // useFactory: async (configService: ConfigService) => {
    //     const store = await redisStore({
    //         socket: {
    //             host: configService.get<string>("REDIS_HOST", "localhost"),
    //             port: configService.get<number>("REDIS_PORT", 6379),
    //         },
    //         ttl: configService.get<number>("REDIS_TTL", 3600), // TTL mặc định 1 giờ
    //     });

    //     console.log("Cache Store (Fixed):", store); // Debug kiểm tra store

    //     return {
    //         store, // Đảm bảo `store` nhận Redis store
    //         ttl: configService.get<number>("REDIS_TTL", 3600),
    //     };
    // },
};

// ({
//     ttl: configService.get('REDIS_TTL'),
//     // store: redisStore,
//     // options: {
//     //     uri: 'redis://localhost:6379', // Thay đổi nếu Redis chạy ở server khác
//     // },
//     // store: createKeyv('redis://localhost:6379'),
//     store: await redisStore({
//         socket: {
//             host: configService.get('REDIS_HOST'),
//             port: configService.get('REDIS_PORT'),
//         },
//     }),
//     // store: createKeyv('redis://localhost:6379'),
// })