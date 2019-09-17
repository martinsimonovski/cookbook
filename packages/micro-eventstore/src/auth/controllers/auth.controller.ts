import { Controller } from '@nestjs/common';
import { CreateUserDto } from 'auth/dtos/user.dto';
import { AuthService } from 'auth/services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    async createUser(data: CreateUserDto): Promise<CreateUserDto> {
        return this.authService.createNewUser({ ...data });
    }
}