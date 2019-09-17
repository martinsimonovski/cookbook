import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { IsEmail } from "class-validator";
import * as crypto from 'crypto';
interface IUser {
    id: string;
    username: string;
    email: string;
    password: string;
    role: number;
    valid: boolean;
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
        console.warn('hashing password', this.password);
    }

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: [0, 1, 2],
        default: 0,
    })
    role: number;

    @Column({
        default: false
    })
    valid: boolean;

    constructor(user: IUser = {
        id: null,
        username: "",
        password: "",
        email: "",
        role: 0,
        valid: false
    }) {
        this.id = user.id;
        this.username = user.username;
        this.password = user.password;
        this.email = user.email;
        this.role = user.role;
        this.valid = user.valid;
    }
}
