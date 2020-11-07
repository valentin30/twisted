import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    name: string

    @Column()
    email: string

    @Column()
    password: string
}