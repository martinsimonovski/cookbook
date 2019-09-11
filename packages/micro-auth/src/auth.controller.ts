import { Controller, Logger, UseFilters } from '@nestjs/common';
import { GrpcMethod, ClientGrpc, Client, Transport } from '@nestjs/microservices';
import * as grpc from 'grpc';
import { ExceptionFilter } from '@cookbook/common/dist/src/filters/grpcException.filter';
import { grpcResponse } from '@cookbook/common/dist/src/responses/formatGrpsResponse';
import { GrpcInternalError } from '@cookbook/common/dist/src/utils/GrpcErrors';
import { AuthService } from './auth.service';
import { User } from './entities';
import { join } from 'path';
import { Observable } from 'rxjs';

interface EmailService {
    register(data: {
        from: string;
        to: string | string[];
        subject: string;
        text: string;
        html: string;
    }): Observable<any>;
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

    private emailService;

    constructor(private readonly authService: AuthService) {
        console.log(__dirname + '/**/*.entity{.ts,.js}');
    }

    onModuleInit() {
        this.emailService = this.client.getService<EmailService>('EmailService')
    }

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
}
