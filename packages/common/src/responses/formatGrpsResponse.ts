import { Logger } from '@nestjs/common';
import { status as grpcStatus } from 'grpc';
import { GrpcAnswer } from '../utils/types';
import { GrpcInternalError } from '../utils/GrpcErrors';

export const formatGrpcResponse = async <P extends unknown[], R>(
    service: (...args: P) => Promise<R>,
    args: P,
): Promise<GrpcAnswer<R>> => {
    const logger = new Logger('FormatGrpcResponse');
    let data: R = ({} as unknown) as R;
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
    return { status: grpcStatus.OK, data }
}