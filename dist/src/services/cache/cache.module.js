"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheCustomModule = void 0;
const common_1 = require("@nestjs/common");
const cache_service_1 = require("./cache.service");
const cache_manager_1 = require("@nestjs/cache-manager");
const redis_config_1 = require("../../common/configs/redis.config");
let CacheCustomModule = class CacheCustomModule {
};
exports.CacheCustomModule = CacheCustomModule;
exports.CacheCustomModule = CacheCustomModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.registerAsync(redis_config_1.RedisOptions),
        ],
        providers: [cache_service_1.CacheService],
        exports: [cache_service_1.CacheService, cache_manager_1.CacheModule],
    })
], CacheCustomModule);
//# sourceMappingURL=cache.module.js.map