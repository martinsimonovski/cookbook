import { Injectable, Logger, UseFilters } from '@nestjs/common';
import { Repository, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as cryptoRandomString from 'crypto-random-string';
import { User, EmailVerification } from './entities';
import { GrpcAlreadyExistError, ExceptionFilter } from './lib';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(EmailVerification) private emailVerificationRepository: Repository<EmailVerification>) { }

    public async register(user: User): Promise<User> {
        this.logger.log('registerFN()')
        return await this.userRepository.save(user);
    }

    public async createNewUser(user: User): Promise<User> {
        const { username, email } = user;
        const qb = await getRepository(User)
            .createQueryBuilder('user')
            .where('user.username = :username', { username })
            .orWhere('user.email = :email', { email });
        const userRegisterd = await qb.getOne();

        if (!userRegisterd) {
            return await this.userRepository.save(user);
        } else {
            return userRegisterd;
        }
        // insert throw errors
    }

    public async createEmailToken(email: string): Promise<EmailVerification> {
        let emailVerification;
        await this.emailVerificationRepository.findOne({ email }).then(ev => emailVerification = ev);

        if (emailVerification && this.emailVerificationIsFresh(emailVerification.timestamp.getTime())) {
            throw new GrpcAlreadyExistError('Email already sent');
        } else {
            emailVerification = new EmailVerification(
                {
                    id: emailVerification ? emailVerification.id : "",
                    email,
                    emailToken: this.generateVerificationToken(),
                    timestamp: new Date()
                }
            );
        }

        return this.emailVerificationRepository.save(emailVerification);
    }

    public async sendEmailVerification(email: string): Promise<boolean> {
        return true;
    }

    private emailVerificationIsFresh(time: number): Boolean {
        return (new Date().getTime() - time) / 60000 < 15;
    }

    private generateVerificationToken() {
        return cryptoRandomString({ length: 10 });
    }
}
