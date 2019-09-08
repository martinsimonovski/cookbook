import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { IsEmail } from 'class-validator';

interface IEmailVerification {
    id?: string;
    email: string;
    emailToken: string;
    timestamp: Date
}

@Entity()
export class EmailVerification implements IEmailVerification {
    @PrimaryGeneratedColumn()
    id?: string;

    @Column({
        unique: true
    })
    @IsEmail()
    email: string;

    @Column()
    emailToken: string;

    @Column()
    timestamp: Date;

    constructor(ev: IEmailVerification = {
        id: "",
        email: "",
        emailToken: '',
        timestamp: new Date()
    }) {
        this.id = ev.id;
        this.email = ev.email;
        this.emailToken = ev.emailToken;
        this.timestamp = ev.timestamp;
    }
}