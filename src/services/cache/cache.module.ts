import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from 'src/common/configs/redis.config';

@Module({
    imports: [
        CacheModule.registerAsync(RedisOptions),
    ],
    providers: [CacheService],
    exports: [CacheService, CacheModule],
})
export class CacheCustomModule {}
