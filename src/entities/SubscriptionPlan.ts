import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { NurserySubscription } from "./NurserySubscription";

@Entity("subscription_plans")
export class SubscriptionPlan {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 150, unique: true })
    name!: string;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    monthly_price!: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    yearly_price!: number;

    @Column({ type: "int", default: 0 })
    max_children!: number;

    @Column({ type: "boolean", default: false })
    ai_reports_enabled!: boolean;

    @Column({ type: "text", nullable: true })
    description!: string;

    @Column({ type: "boolean", default: true })
    is_active!: boolean;

    // العلاقة مع اشتراكات الحضانات تم الحفاظ عليها
    @OneToMany(() => NurserySubscription, (subscription) => subscription.plan)
    subscriptions!: NurserySubscription[];

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}