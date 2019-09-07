import { Controller, Logger, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { formatGrpcResponse } from './lib/responses/formatGrpsResponse';
import { AuthService } from './auth.service';
import { User } from './entities';
import { ExceptionFilter } from './lib/filters/grpcException.filter';
import * as grpc from 'grpc';

@Controller()
export class AuthController {
    private logger = new Logger('AuthController');

    constructor(private readonly authService: AuthService) { }

    @UseFilters(new ExceptionFilter())
    @GrpcMethod('AuthService', 'Register')
    register(data: User, metadata: grpc.Metadata) {
        const serviceFn = this.authService.register.bind(this.authService);
        return formatGrpcResponse(serviceFn, [data]);
    }
}
