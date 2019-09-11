import { Module, Logger } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, EmailVerification, ConsentRegistry } from './entities';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'admin',
            password: 'admin',
            database: 'micro_auth',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([User, EmailVerification, ConsentRegistry])
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {
    logger = new Logger('AuthModule');
    constructor() {

        this.logger.log(__dirname + '/**/*.entity{.ts,.js}', '=====>')
    }
}
