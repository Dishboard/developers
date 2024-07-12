import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Cache {
    @PrimaryColumn()
    key: string;

    @Column('jsonb')
    value: Record<string, any>;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}