import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ApiKey {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  key: string;

  @Column()
  uuid: string;

  @ManyToOne((type) => User, (user) => user.apiKey)
  user: User;
}
