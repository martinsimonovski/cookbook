import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

interface IConsentRegistry {
    id?: string;
    email: string;
    registrationForm: string[];
    checkboxText: string;
    date: Date;
    privacyPolicy: string;
    cookiePolicy: string;
    acceptedPolicy: string;
}

@Entity()
export class ConsentRegistry implements IConsentRegistry {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column({ type: 'simple-array' })
    registrationForm: string[];

    @Column()
    checkboxText: string;

    @Column()
    date: Date;

    @Column()
    privacyPolicy: string;

    @Column()
    cookiePolicy: string;

    @Column()
    acceptedPolicy: string;

    constructor(data: IConsentRegistry = {
        id: null,
        email: '',
        registrationForm: [],
        checkboxText: '',
        date: new Date(),
        privacyPolicy: "",
        cookiePolicy: "",
        acceptedPolicy: ""
    }) {
        this.id = data.id;
        this.email = data.email;
        this.registrationForm = data.registrationForm;
        this.checkboxText = data.checkboxText;
        this.date = data.date;
        this.privacyPolicy = data.privacyPolicy;
        this.cookiePolicy = data.cookiePolicy;
        this.acceptedPolicy = data.acceptedPolicy;
    }
}