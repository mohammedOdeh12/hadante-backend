import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { NurserySubscription } from "./NurserySubscription";
import { Media } from "./Media"; 
import { User } from "./User"; // استدعاء كائن المستخدم

@Entity("nurseries")
export class Nursery {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 150 })
    name!: string;

    @Column({ type: "varchar", length: 150, unique: true })
    email!: string;

    @Column({ type: "varchar", length: 20, nullable: true })
    phone!: string;

    @Column({ type: "text", nullable: true })
    address!: string;

    @Column({ type: "varchar", length: 7, nullable: true })
    main_color!: string;

    @Column({ type: "boolean", default: true })
    is_active!: boolean;

    // إرجاع العلاقة مع جدول الميديا
    @OneToOne(() => Media, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "logo_id" })
    logo!: Media;

    // العلاقة مع الاشتراكات 
    @OneToMany(() => NurserySubscription, (subscription) => subscription.nursery)
    subscriptions!: NurserySubscription[];

    // علاقة الحضانة بموظفيها (الحضانة الواحدة تمتلك عدة مستخدمين/موظفين)
    @OneToMany(() => User, (user) => user.nursery)
    users!: User[];

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}