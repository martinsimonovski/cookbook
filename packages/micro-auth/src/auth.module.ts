import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, EmailVerification, ConsentRegistry } from './entities';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

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
        TypeOrmModule.forFeature([User, EmailVerification, ConsentRegistry]),
        PassportModule,
        JwtModule.register({
            secret: 'secret',
            signOptions: { expiresIn: '60s' },
        }),
    ],
    controllers: [
        AuthController
    ],
    providers: [
        AuthService,
    ],
})
export class AuthModule { }
