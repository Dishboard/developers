import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../caching/caching.service';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
    constructor(private readonly cacheService: CacheService) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const ctx = context.getArgs();
        const key = ctx[1].lang;
        const cachedData = await this.cacheService.get(key);

        if (cachedData) {
            return of(cachedData);
        }

        return next.handle().pipe(
            tap((data) => {
                this.cacheService.set(key, data);
            })
        );
    }
}
