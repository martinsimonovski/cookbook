import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { formatGrpcResponse } from './lib/formatGrpsResponse';
import { AuthService } from './auth.service';
import { User } from './entities';

@Controller()
export class AuthController {
    private logger = new Logger('AuthController');

    constructor(private readonly authService: AuthService) { }

    @GrpcMethod('AuthService', 'Register')
    register(data: User, metadata: any) {
        this.logger.log('===>>> ', JSON.stringify({ data, metadata }));
        const serviceFn = this.authService.register.bind(this.authService);
        return formatGrpcResponse(serviceFn, [data]);

        // return this.authService.register(data).then(response => {
        //     this.logger.log('===>>> Response', JSON.stringify(response));
        //     return {
        //         status: true,
        //         action: 'bla bla',
        //         data: { ...response },
        //         message: 'this is a test 3'
        //     }
        // }, error => {
        //     return {
        //         status: false,
        //         action: 'bla bla',
        //         data: {},
        //         message: 'Some error has happened'
        //     }
        // });

        // const serviceFn = this.authService.register.bind(this.authService);
        // return formatGrpcResponse(serviceFn, [authCredentialsDto]);
    }
}
