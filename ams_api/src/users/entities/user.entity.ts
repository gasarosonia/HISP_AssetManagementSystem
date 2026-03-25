import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Department } from '../../departments/entities/department.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    full_name: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password_hash: string;

    @Column()
    role: string; // 'Staff', 'HOD', 'Admin and Finance', 'Office of the CEO'

    @ManyToOne(() => Department, (dept) => dept.users)
    @JoinColumn({ name: 'department_id' })
    department: Department;
}