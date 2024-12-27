import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication, NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create<NestApplication>(AppModule);

    app.useGlobalPipes(new ValidationPipe({ whitelist: false, transform: false }));

    // Apply the global exception filter
    app.useGlobalFilters(new AllExceptionsFilter());

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    const configService = app.get(ConfigService);
    const port = configService.get('PORT');

    const host = '0.0.0.0';
    await app.listen(port, host);
}

bootstrap();
