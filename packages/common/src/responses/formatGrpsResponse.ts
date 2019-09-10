import { Logger } from '@nestjs/common';
import { status as grpcStatus } from 'grpc';
import { GrpcAnswer, GrpcErrorResponse } from '../utils/types';
import { GrpcInternalError } from '../utils/GrpcErrors';

export const formatGrpcResponse = async <P extends unknown[], R>(
    service: (...args: P) => Promise<R>,
    args: P,
): Promise<GrpcAnswer<R>> => {
    const logger = new Logger('FormatGrpcResponse');
    let data: R = ({} as unknown) as R;
    let response: GrpcErrorResponse;
    let status: grpcStatus;

    try {
        data = await service(...args);
        status = grpcStatus.OK;
    } catch (e) {
        logger.log(JSON.stringify({ exception: e, args }), 'FormatGrpcResponse:Catch');
        throw new GrpcInternalError('Database error', e);
    }

    return { status, data };
};


export const grpcResponse = (data: any) => {
    const logger = new Logger('GrpcResponse');
    let status: grpcStatus = grpcStatus.OK;
    return { status, data }
}