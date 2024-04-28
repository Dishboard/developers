import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { graphqlConfig, typeormConfig } from './config';
import { ExchangeRateModule } from './services/exchange-rate/exchange-rate.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ScheduleModule.forRoot(),
        TypeOrmModule.forRoot(typeormConfig),
        GraphQLModule.forRoot(graphqlConfig),
        ExchangeRateModule,
    ],
    controllers: [],
})
export class AppModule {}
