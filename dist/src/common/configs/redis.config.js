"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisOptions = void 0;
const redis_1 = require("@keyv/redis");
exports.RedisOptions = {
    isGlobal: true,
    useFactory: () => ({
        stores: [
            new redis_1.default(`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`),
        ],
    }),
};
//# sourceMappingURL=redis.config.js.map