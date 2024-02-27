import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../enums/role.enum';
import {
  Permission,
  PermissionType,
} from 'src/iam/authorization/permission.type';
import { ApiKey } from '../api-keys/entities/api-key.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @JoinTable()
  @OneToMany((type) => ApiKey, (apiKey) => apiKey.user)
  apiKey: ApiKey[];

  @Column({ enum: Role, default: Role.Regular })
  role: Role;

  @Column({ enum: Permission, default: [], type: 'json' })
  permissions: PermissionType[];
}
