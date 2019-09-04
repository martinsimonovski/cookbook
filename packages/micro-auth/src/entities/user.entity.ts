import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { IsEmail } from "class-validator";
import * as crypto from 'crypto';

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
    role: string;
}
