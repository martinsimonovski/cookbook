import { status } from 'grpc';

export interface GrpcStatus {
    code: status;
    message?: string;
    details?: unknown[];
}

export interface GrpcAnswer<T extends unknown = unknown> {
    status: GrpcStatus;
    data: T;
}