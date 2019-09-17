import { Injectable } from '@nestjs/common';
import { User } from '../models/user.model';

@Injectable()
export class UserRepository {
    async createUser(userDto) {
        const user = new User(undefined);
        user.setData(userDto);
        user.createUser();
        return user;
    }
}