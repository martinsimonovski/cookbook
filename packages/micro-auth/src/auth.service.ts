import { Injectable, Logger, UseFilters } from '@nestjs/common';
import { Repository, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as cryptoRandomString from 'crypto-random-string';
import { User, EmailVerification, ConsentRegistry } from './entities';
import { GrpcAlreadyExistError, ExceptionFilter, GrpcCanceledError, GrpcAbortedError } from './lib';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(EmailVerification) private emailVerificationRepository: Repository<EmailVerification>,
        @InjectRepository(ConsentRegistry) private concentRegistryRepository: Repository<ConsentRegistry>,
    ) { }

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
            const prevId = emailVerification ? emailVerification.id : null;
            emailVerification = new EmailVerification(
                {
                    email,
                    emailToken: this.generateVerificationToken(),
                    timestamp: new Date()
                }
            );
            if (prevId) {
                emailVerification.id = prevId;
            }
        }

        try {
            return this.emailVerificationRepository.save(emailVerification);
        } catch (e) {
            throw new GrpcAbortedError('Email verification: creating email token');
        }
    }

    public async saveUserConsent(email: string): Promise<ConsentRegistry> {
        let newConsent = new ConsentRegistry(
            {
                email: email,
                date: new Date(),
                registrationForm: ["name", "surname", "email", "birthday date", "password"],
                checkboxText: "I accept privacy policy",
                privacyPolicy: "Some privacy policy",
                cookiePolicy: "Some cookie policy",
                acceptedPolicy: 'Y'
            }
        );
        try {

            return this.concentRegistryRepository.save(newConsent);
        } catch (e) {
            throw new GrpcAbortedError('Save user consent');
        }
    }

    public async sendEmailVerification(email: string): Promise<boolean> {
        let emailVer = await this.emailVerificationRepository.findOne({ email: email }).then(r => r);
        if (emailVer && emailVer.emailToken) {

        }
        return true;
    }

    private emailVerificationIsFresh(time: number): Boolean {
        return (new Date().getTime() - time) / 60000 < 15;
    }

    private generateVerificationToken() {
        return cryptoRandomString({ length: 10 });
    }
}
