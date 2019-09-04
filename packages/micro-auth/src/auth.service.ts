import { Injectable, Logger } from '@nestjs/common';

import { User } from './entities';
import { validate } from 'class-validator';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');

    constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

    public async register(user: User): Promise<User> {
        return await this.userRepository.save(user);
        // return validate(user).then(errors => { // errors is an array of validation errors
        //     this.logger.log("....validation: ", JSON.stringify(user));
        //     if (errors.length > 0) {
        //         this.logger.log("validation failed. errors: ", JSON.stringify(errors));
        //     } else {
        //         this.logger.log("validation succeed");
        //         return this.userRepository.save(user).then(response => {
        //             this.logger.log("VALID...", JSON.stringify({ response }));
        //             return response;
        //         }, error => {
        //             this.logger.log("REJECT...", JSON.stringify(error));
        //             return error;
        //         });
        //     }
        // });
    }

    // public async assertEmailDoesNotExist(email: string) {
    //     const emailAlreadyExist = true; // get logic
    //     if (emailAlreadyExist) {
    //         throw new GrpcAlreadyExistException('Email already exist');
    //     }
    // }
}
