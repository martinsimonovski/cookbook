import { Controller, Logger, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { grpcResponse } from './lib/responses/formatGrpsResponse';
import { AuthService } from './auth.service';
import { User } from './entities';
import { ExceptionFilter } from './lib/filters/grpcException.filter';
import * as grpc from 'grpc';
import { GrpcUnkownError, GrpcInternalError } from './lib';

@Controller()
export class AuthController {
    private logger = new Logger('AuthController');

    constructor(private readonly authService: AuthService) { }

    @UseFilters(new ExceptionFilter())
    @GrpcMethod('AuthService', 'Register')
    async register(data: User, metadata: grpc.Metadata) {
        const user = await this.authService.createNewUser(data).then(res => res);
        await this.authService.createEmailToken(user.email);
        await this.authService.saveUserConsent(user.email);
        // let sent = this.authService.sendEmailVerification(user.email).then(res => res);
        // if (sent) {
        //     return user;
        // } else {
        //     throw new GrpcInternalError('Email problem');
        // }

        return grpcResponse(user);
    }
}
