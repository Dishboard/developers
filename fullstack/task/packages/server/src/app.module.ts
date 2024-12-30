import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { graphqlConfig, typeormConfig } from './config';
import { modules } from './entity-modules';
import { ExchangeRateModule } from './services/exchange-rate/exchange-rate.module';
import { exchangeRateConfig } from './config/exchange-rates';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [() => ({ exchangeRate: exchangeRateConfig })], 
        }),
        TypeOrmModule.forRoot(typeormConfig),
        GraphQLModule.forRoot(graphqlConfig),
        ExchangeRateModule,
        ...modules,
    ],
    controllers: [],
})
export class AppModule {}
