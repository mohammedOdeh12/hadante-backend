import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Nursery } from "./Nursery";
import { SubscriptionPlan } from "./SubscriptionPlan";

@Entity("nursery_subscriptions")
export class NurserySubscription {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "date" })
    start_date!: Date;

    @Column({ type: "date" })
    end_date!: Date;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    amount_paid!: number;

    @Column({ type: "varchar", length: 50, default: "active" })
    status!: string;

    // علاقة مع الحضانة
    @ManyToOne(() => Nursery, (nursery) => nursery.subscriptions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "nursery_id" })
    nursery!: Nursery;

    // علاقة مع خطة الاشتراك
    @ManyToOne(() => SubscriptionPlan, (plan) => plan.subscriptions, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "plan_id" })
    plan!: SubscriptionPlan;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}