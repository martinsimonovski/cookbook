import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');

    constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

    public async register(user: User): Promise<User> {
        this.logger.log('registerFN()')
        return await this.userRepository.save(user);
    }
}
