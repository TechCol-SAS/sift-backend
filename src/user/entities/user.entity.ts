import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, name: 'first_name', nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 50, name: 'last_name', nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  @Column({
    type: 'boolean',
    name: 'is_active',
    nullable: false,
    default: true,
  })
  isActive: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'refresh_token',
    nullable: true,
    unique: true,
  })
  refreshToken?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;
}
