import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Role } from "./Role";

@Entity("super_admins")
export class SuperAdmin {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 100 })
    name!: string;

    @Column({ type: "varchar", length: 150, unique: true })
    email!: string;

    @Column({ type: "varchar" })
    password_hash!: string;

    @Column({ type: "boolean", default: true })
    is_active!: boolean;

    @ManyToOne(() => Role, (role) => role.superAdmins, { onDelete: "SET NULL", nullable: true })
    @JoinColumn({ name: "role_id" })
    role!: Role;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}