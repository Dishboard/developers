import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cache } from '../../entities/cache.entity';
import { CACHE_LIFETIME } from 'src/entities/constants';

@Injectable()
export class CacheService {
    constructor(
        @InjectRepository(Cache)
        private cacheRepository: Repository<Cache>
    ) {}

    async get(key: string): Promise<Cache | null> {
        const cacheEntry = await this.cacheRepository.findOneBy({ key });

        if (!cacheEntry) {
            return null;
        }

        const now = new Date().getTime();
        const cacheTime = new Date(cacheEntry.createdAt).getTime();
        if (now - cacheTime > CACHE_LIFETIME) {
            await this.cacheRepository.delete(key);
            return null;
        }
        return cacheEntry;
    };

    async set(key: string, value: any): Promise<void> {
        try {
           await this.cacheRepository.save({
               key,
               ...value,
           }); 
        } catch (error) {
            throw error;
        }
    }
}
