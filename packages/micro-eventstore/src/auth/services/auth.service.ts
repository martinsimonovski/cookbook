import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserDto } from '../dtos/user.dto';
import { CreateUserCommand } from '../commands/impl/create-user.command';

@Injectable()
export class AuthService {
    constructor(private readonly commandBus: CommandBus) { }

    public async createNewUser(user: CreateUserDto) {
        return await this.commandBus.execute(
            new CreateUserCommand(user)
        );
    }

}
