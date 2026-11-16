import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Nursery } from "./Nursery";
import { Role } from "./Role";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    // تم إضافة type: "varchar"
    @Column({ type: "varchar", length: 150 })
    name!: string;

    // تم إضافة type: "varchar"
    @Column({ type: "varchar", length: 150, unique: true })
    email!: string;

    // تم إضافة type: "varchar"
    @Column({ type: "varchar", select: false }) 
    password!: string;

    // تم إضافة type: "boolean"
    @Column({ type: "boolean", default: true })
    is_active!: boolean;

    // --- العلاقات ---

    @ManyToOne(() => Nursery, (nursery) => nursery.users, { onDelete: "CASCADE" })
    @JoinColumn({ name: "nursery_id" })
    nursery!: Nursery;

    @ManyToOne(() => Role, (role) => role.users, { onDelete: "SET NULL", nullable: true })
    @JoinColumn({ name: "role_id" })
    role!: Role;

    @CreateDateColumn()
    created_at! : Date;
}