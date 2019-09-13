import { Injectable, Logger } from '@nestjs/common';
import { Repository, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as cryptoRandomString from 'crypto-random-string';
import * as nodemailer from 'nodemailer';
import * as doetnv from 'dotenv';
import { Observable } from 'rxjs';
import { ClientGrpc, Transport, Client } from '@nestjs/microservices';
import { GrpcAlreadyExistError, GrpcAbortedError } from '@cookbook/common';
import { User, EmailVerification, ConsentRegistry } from './entities';
import { join } from 'path';

interface EmailService {
    register(data: {
        from: string;
        to: string | string[];
        subject: string;
        text: string;
        html: string;
    }): Observable<any>;
}

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');

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

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(EmailVerification) private emailVerificationRepository: Repository<EmailVerification>,
        @InjectRepository(ConsentRegistry) private concentRegistryRepository: Repository<ConsentRegistry>,
    ) { }

    onModuleInit() {
        this.emailService = this.client.getService<EmailService>('EmailService')
    }

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
        let ev = await this.emailVerificationRepository.findOne({ email: email }).then(r => r);
        let config = doetnv.config();
        config = config.parsed;

        if (ev && ev.emailToken) {
            let transporter = nodemailer.createTransport(
                {
                    host: config.SMTP_HOST,
                    port: config.SMTP_PORT,
                    auth: {
                        user: config.SMTP_USERNAME,
                        pass: config.SMTP_PASSWORD
                    }
                }
            );

            let mailOptions = {
                from: 'contact@cookbook.com',
                to: [email],
                subject: 'Verify Email',
                text: 'Verify Email',
                html: 'Hi! <br><br> Thanks for your registration<br><br>' +
                    '<a href="http://localhost:3000/auth/email/verify/' + ev.emailToken + '>Click here to activate your account</a>'  // html body
            };

            return await this.emailService.send(mailOptions).toPromise().then(result => {
                return result;
            })
        }
        return false;
    }

    private emailVerificationIsFresh(time: number): Boolean {
        return (new Date().getTime() - time) / 60000 < 15;
    }

    private generateVerificationToken() {
        return cryptoRandomString({ length: 10 });
    }
}
