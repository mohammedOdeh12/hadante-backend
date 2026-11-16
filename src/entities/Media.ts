import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Nursery } from "./Nursery";

@Entity("media")
export class Media {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255 })
    file_name!: string;

    @Column({ type: "varchar", length: 500 })
    file_url!: string;

    @Column({ type: "varchar", length: 50 })
    file_type!: string;

    @ManyToOne(() => Nursery, { onDelete: "CASCADE", nullable: true })
    @JoinColumn({ name: "nursery_id" })
    nursery!: Nursery;

    @CreateDateColumn()
    created_at!: Date;
}