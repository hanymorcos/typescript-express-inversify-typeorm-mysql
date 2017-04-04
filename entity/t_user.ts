import {Table, Column, PrimaryGeneratedColumn} from "typeorm";

@Table()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;
}