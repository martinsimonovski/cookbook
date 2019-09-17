import { IsString, IsBoolean } from 'class-validator';

export class CreateUserDto {
    @IsString()
    readonly id!: string;

    @IsString()
    readonly email!: string;

    @IsString()
    readonly username!: string;

    @IsString()
    readonly password!: string;

    @IsString()
    readonly confirmPassword!: string;
}