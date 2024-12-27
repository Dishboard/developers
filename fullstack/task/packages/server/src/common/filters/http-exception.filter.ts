import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const gqlHost = GqlArgumentsHost.create(host);
        if (gqlHost.getInfo()) {
            return new Error(exception.message || 'An unexpected error occurred.');
        }

        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exception.message || 'An unexpected error occurred. Please try again later.',
        };

        response.status(status).json(errorResponse);

        return null;
    }
}
