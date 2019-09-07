// import { status as grpcStatus } from 'grpc';
// import {
//     HttpException,
//     InternalServerErrorException,
//     HttpStatus,
//     BadRequestException,
//     GatewayTimeoutException,
//     NotFoundException,
//     ConflictException,
//     UnauthorizedException,
//     ForbiddenException,
//     ServiceUnavailableException,
// } from '@nestjs/common';
// import { isObject } from 'util';

// const createHttpExceptionBody = (message: object | string, error?: string, statusCode?: number) => {
//     if (!message) {
//         return { statusCode, error };
//     }
//     return isObject(message) && !Array.isArray(message) ? message : { statusCode, error, message };
// };

// const createHttpException = (status: number, defaultError: string = '') => {
//     class CustomHttpException extends HttpException {
//         public constructor(message?: string | object | any, error = defaultError) {
//             super(createHttpExceptionBody(message, error, status), status);
//         }
//     }
//     return CustomHttpException;
// };

// export const GrpcToHttpExceptionMapping = {
//     [grpcStatus.OK]: null,
//     [grpcStatus.CANCELLED]: createHttpException(499, 'Client Closed Request'),
//     [grpcStatus.UNKNOWN]: InternalServerErrorException,
//     [grpcStatus.INVALID_ARGUMENT]: BadRequestException,
//     [grpcStatus.DEADLINE_EXCEEDED]: GatewayTimeoutException,
//     [grpcStatus.NOT_FOUND]: NotFoundException,
//     [grpcStatus.ALREADY_EXISTS]: ConflictException,
//     [grpcStatus.PERMISSION_DENIED]: ForbiddenException,
//     [grpcStatus.UNAUTHENTICATED]: UnauthorizedException,
//     [grpcStatus.RESOURCE_EXHAUSTED]: createHttpException(HttpStatus.TOO_MANY_REQUESTS, 'Too Many Request'),
//     [grpcStatus.FAILED_PRECONDITION]: BadRequestException,
//     [grpcStatus.DEADLINE_EXCEEDED]: GatewayTimeoutException,
//     [grpcStatus.ABORTED]: ConflictException,
//     [grpcStatus.OUT_OF_RANGE]: BadRequestException,
//     [grpcStatus.UNIMPLEMENTED]: createHttpException(501, 'Not Implemented'),
//     [grpcStatus.INTERNAL]: InternalServerErrorException,
//     [grpcStatus.UNAVAILABLE]: ServiceUnavailableException,
//     [grpcStatus.DATA_LOSS]: InternalServerErrorException,
// };