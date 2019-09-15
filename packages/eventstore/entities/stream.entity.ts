import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Stream {
    @PrimaryGeneratedColumn('uuid')
    public streamId!: string;

    @Column('int')
    public version!: number;

    @Column('text')
    public type!: string;
}