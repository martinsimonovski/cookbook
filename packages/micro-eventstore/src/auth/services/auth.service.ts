import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { User } from './entities';



@Injectable()
export class AuthService {

    constructor(
        private readonly commandBus: CommandBus
    ) { }

    public async createNewUser(user: User): Promise<User> {
        return await this.commandBus.execute(
            new CreateUserCommand(user)
        );
    }

}
