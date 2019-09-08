import { Controller, Logger, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { formatGrpcResponse } from './lib/responses/formatGrpsResponse';
import { AuthService } from './auth.service';
import { User } from './entities';
import { ExceptionFilter } from './lib/filters/grpcException.filter';
import * as grpc from 'grpc';
import { GrpcUnkownError } from './lib';

@Controller()
export class AuthController {
    private logger = new Logger('AuthController');

    constructor(private readonly authService: AuthService) { }

    @UseFilters(new ExceptionFilter())
    @GrpcMethod('AuthService', 'Register')
    async register(data: User, metadata: grpc.Metadata) {
        const newUser = await this.authService.createNewUser(data).then(response => {
            return response;
        });
        await this.authService.createEmailToken(newUser.email);

        return newUser;
    }
}
