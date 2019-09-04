
import { Logger } from '@nestjs/common';
import { status as grpcStatus } from 'grpc';

import { GrpcException } from './exception';
import { GrpcStatus, GrpcAnswer } from './types';

const logger = new Logger('formatGrpcResponse');

export const formatGrpcResponse = async <P extends unknown[], R>(
    service: (...args: P) => Promise<R>,
    args: P,
): Promise<GrpcAnswer<R>> => {
    let data: R = ({} as unknown) as R;
    let status: GrpcStatus;
    try {
        logger.log('=>> <<==');
        data = await service(...args);
        status = { code: grpcStatus.OK };
        logger.log('=>> <<==', JSON.stringify({ data, status }));
    } catch (e) {
        if (e instanceof GrpcException) {
            status = { code: e.code, message: e.message };
        } else {
            throw e;
        }
    }
    return { data, status };
};