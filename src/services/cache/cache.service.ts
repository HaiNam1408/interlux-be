import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { 
        console.log('Cache Store:', this.cacheManager);
    }

    async set(key: string, value: any, ttl?: number) {
        await this.cacheManager.set(key, value, ttl );
    }

    async get<T>(key: string): Promise<T | null> {
        return await this.cacheManager.get<T>(key);
    }

    async del(key: string) {
        await this.cacheManager.del(key);
    }
}
