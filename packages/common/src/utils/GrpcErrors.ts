import { status } from 'grpc';

export interface IGrpcError {
    status: status;
    message: string;
    error?: object;
}

export class GrpcError implements IGrpcError {
    public readonly status: status;
    public readonly message: string;
    public readonly error: object;

    constructor(
        private readonly code: status,
        private readonly msg: string,
        private readonly errorData?: any | null
    ) {
        this.status = code;
        this.message = msg;
        this.error = errorData ? Buffer.from(JSON.stringify(errorData)) : {};
    }

    getError() {
        return this.error;
    }

    getStatus() {
        return this.status;
    }

    getMessage() {
        return this.message;
    }

    getCleanError() {
        return JSON.parse(this.error.toString());
    }
}

export class GrpcCanceledError extends GrpcError {
    public constructor(message: string, error?: any | null) {
        super(status.CANCELLED, message, error);
    }
}

export class GrpcUnkownError extends GrpcError {
    public constructor(message: string, error?: any | null) {
        super(status.UNKNOWN, message, error);
    }
}

export class GrpcInvalidArgumentError extends GrpcError {
    public constructor(message: string, error?: any | null) {
        super(status.INVALID_ARGUMENT, message, error);
    }
}

export class GrpcDeadlineExceededError extends GrpcError {
    public constructor(message: string, error?: any | null) {
        super(status.DEADLINE_EXCEEDED, message, error);
    }
}

export class GrpcNotFoundError extends GrpcError {
    public constructor(message: string, error?: any | null) {
        super(status.NOT_FOUND, message, error);
    }
}

export class GrpcAlreadyExistError extends GrpcError {
    public constructor(message: string, error?: any | null) {
        super(status.ALREADY_EXISTS, message, error);
    }
}

export class GrpcPermissionDeniedError extends GrpcError {
    public constructor(message: string, error?: any | null) {
        super(status.PERMISSION_DENIED, message, error);
    }
}

export class GrpcUnauthenticatedError extends GrpcError {
    public constructor(message: string, error?: any | null) {
        super(status.UNAUTHENTICATED, message, error);
    }
}

export class GrpcRessourceExhaustedError extends GrpcError {
    public constructor(message: string, error?: any | null) {
        super(status.RESOURCE_EXHAUSTED, message, error);
    }
}

export class GrpcFailedPreconditionError extends GrpcError {
    public constructor(message: string, error?: any | null) {
        super(status.FAILED_PRECONDITION, message, error);
    }
}

export class GrpcAbortedError extends GrpcError {
    public constructor(message: string, error?: any | null) {
        super(status.ABORTED, message, error);
    }
}

export class GrpcOutOfRangeError extends GrpcError {
    public constructor(message: string, error?: any | null) {
        super(status.OUT_OF_RANGE, message, error);
    }
}

export class GrpcUnimplementedError extends GrpcError {
    public constructor(message: string, error?: any | null) {
        super(status.UNIMPLEMENTED, message, error);
    }
}

export class GrpcInternalError extends GrpcError {
    public constructor(message: string, error?: any | null) {
        super(status.CANCELLED, message, error);
    }
}

export class GrpcUnavailableError extends GrpcError {
    public constructor(message: string, error?: any | null) {
        super(status.UNAVAILABLE, message, error);
    }
}

export class GrpcDataLossError extends GrpcError {
    public constructor(message: string, error?: any | null) {
        super(status.DATA_LOSS, message, error);
    }
}