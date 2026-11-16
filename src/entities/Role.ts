import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { SuperAdmin } from "./SuperAdmin";
import { Permission } from "./Permission";
import { User } from "./User"; // استدعاء كائن المستخدم

@Entity("roles")
export class Role {
    @PrimaryGeneratedColumn() 
    id!: number; 

    @Column({ type: "varchar", length: 50, unique: true })
    name!: string;

    @Column({ type: "text", nullable: true })
    description!: string;

    @OneToMany(() => SuperAdmin, (superAdmin) => superAdmin.role)
    superAdmins!: SuperAdmin[];

    @ManyToMany(() => Permission)
    @JoinTable({
        name: "role_permissions",
        joinColumn: { name: "role_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "permission_id", referencedColumnName: "id" }
    })
    permissions!: Permission[];

    // علاقة الدور الوظيفي بالمستخدمين (الدور الواحد يمكن أن يُعطى لعدة مستخدمين)
    @OneToMany(() => User, (user) => user.role)
    users!: User[];

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}