import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm"

@Entity({ name: "User", synchronize: true })
@Index(["email"], { unique: true })
export class User {
    @PrimaryGeneratedColumn("uuid")
    user_id: string

    @Column()
    firstName: string

    @Column()
    email: string

    @Column()
    lastName: string

    @Column()
    password: string

    @Column()
    designation: string

    @Column({ default: false })
    isVerified: boolean
}