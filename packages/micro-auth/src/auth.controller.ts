import { Controller, Logger, UseFilters } from '@nestjs/common';
import { GrpcMethod, ClientGrpc, Client, Transport } from '@nestjs/microservices';
import * as grpc from 'grpc';
import { ExceptionFilter, grpcResponse, GrpcInternalError } from '@cookbook/common';
import { AuthService } from './auth.service';
import { User } from './entities';
import { join } from 'path';

interface VerifyEmail {
    token: string;
}

@Controller()
export class AuthController {
    private logger = new Logger('AuthController');

    @Client({
        transport: Transport.GRPC,
        options: {
            url: '*:50052',
            package: 'email',
            protoPath: join(__dirname, '../../../packages/proto-files/email.proto'),
        },
    })
    client: ClientGrpc;


    constructor(private readonly authService: AuthService) { }

    @UseFilters(new ExceptionFilter())
    @GrpcMethod('AuthService', 'Register')
    async register(data: User, metadata: grpc.Metadata) {
        const user = await this.authService.createNewUser(data).then(res => res);
        await this.authService.createEmailToken(user.email);
        await this.authService.saveUserConsent(user.email);

        let sent = await this.authService.sendEmailVerification(user.email).then(res => res, error => error);

        if (sent && sent.status === 0) {
            return grpcResponse(user);
        } else {
            throw new GrpcInternalError('Email problem', sent);
        }
    }

    @UseFilters(new ExceptionFilter())
    @GrpcMethod('AuthService', 'VerifyEmail')
    async verifyEmail(data: VerifyEmail, metadata: grpc.Metadata) {
        const user: any = await this.authService.verifyEmail(data.token).then(r => r);
        if (user.status === 0) {
            return grpcResponse(0);
        }

        return new GrpcInternalError('There was a problem with verification');
    }
}
