import { Catch, RpcExceptionFilter, ArgumentsHost, Logger } from '@nestjs/common';
import { MESSAGES } from '@nestjs/core/constants';
import { isObject } from '@nestjs/common/utils/shared.utils';
import { Observable, throwError, of } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { GrpcError } from '../utils/GrpcErrors';

export const isError = (exception: any): exception is Error => {
    return !!(isObject(exception) && (exception as Error).message);
};

@Catch()
export class ExceptionFilter<T = any, R = any>
    implements RpcExceptionFilter<T> {
    private static readonly logger = new Logger('RpcExceptionsHandler');

    catch(exception: T, host: ArgumentsHost): Observable<any> {
        if (exception instanceof RpcException) {
            const res = exception.getError();
            const message = isObject(res) ? res : { status, message: res };
            return throwError(message);
        }

        if (exception instanceof GrpcError) {
            return of(exception);
        }

        const errorMessage = MESSAGES.UNKNOWN_EXCEPTION_MESSAGE;

        const loggerArgs = isError(exception)
            ? [exception.message, exception.stack]
            : [exception];
        const logger = ExceptionFilter.logger;
        logger.error.apply(logger, loggerArgs as any);
        return throwError({ status, message: errorMessage });
    }
}