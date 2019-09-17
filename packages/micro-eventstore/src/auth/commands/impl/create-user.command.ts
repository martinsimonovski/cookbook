import { ICommand } from '@nestjs/cqrs';
import { CreateUserDto } from '../../dtos/user.dto';

export class CreateUserCommand implements ICommand {
    constructor(
        public readonly userDto: CreateUserDto
    ) { }
}