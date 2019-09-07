import { status } from 'grpc';

export interface GrpcErrorResponse {
    status: status;
    message: string;
    data?: any;
    error?: any;
}

export interface GrpcAnswer<T extends unknown = unknown> {
    status: status;
    data: T;
}