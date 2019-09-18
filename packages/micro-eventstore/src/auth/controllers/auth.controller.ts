import { Controller, Get } from '@nestjs/common';
import { CreateUserDto } from '../dtos/user.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get()
    async createUser(data: CreateUserDto): Promise<CreateUserDto> {
        let newUser = new CreateUserDto();

        return this.authService.createNewUser({
            id: null,
            email: 'huston@nasa.com',
            username: 'huston',
            password: 'nasa',
            confirmPassword: 'nasa'
        });
    }
}