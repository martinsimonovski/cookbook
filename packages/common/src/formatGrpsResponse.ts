import { Logger } from '@nestjs/common';
import { status as grpcStatus } from 'grpc';

import { GrpcException } from './exception';
import { GrpcStatus, GrpcAnswer } from './types';

export const formatGrpcResponse = async <P extends unknown[], R>(
    service: (...args: P) => Promise<R>,
    args: P,
): Promise<GrpcAnswer<R>> => {
    const logger = new Logger('Common:FormatGrpcResponse');
    logger.log(JSON.stringify({ args }))
    let data: R = ({} as unknown) as R;
    let status: GrpcStatus;
    try {
        data = await service(...args);
        status = { code: grpcStatus.OK };
    } catch (e) {
        if (e instanceof GrpcException) {
            status = { code: e.code, message: e.message };
            logger.log(JSON.stringify({ status }))
        } else {
            logger.log(JSON.stringify({ args: 'noo :(' }))
            throw e;
        }
    }
    return { data, status };
};