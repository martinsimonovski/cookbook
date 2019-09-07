import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { IsEmail } from "class-validator";
import * as crypto from 'crypto';
interface IUser {
    id: string;
    username: string;
    email: string;
    password: string;
    role: number;
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        unique: true
    })
    username: string;

    @Column()
    @IsEmail()
    email: string;

    @BeforeInsert()
    hashPassword() {
        this.password = crypto.createHmac('sha256', this.password).digest('hex');
    }

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: [0, 1, 2],
        default: 0,
    })
    role: number;

    constructor(user: IUser = {
        id: "",
        username: "",
        password: "",
        email: "",
        role: 0
    }) {
        this.id = user.id;
        this.username = user.username;
        this.password = user.password;
        this.email = user.email;
        this.role = user.role;
    }
}
