import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { UserAttempt } from './user-attempt.entity';

@Entity('quiz_user')
export class User {
  @PrimaryColumn({
    name: 'id',
    type: 'uuid',
    default: () => 'gen_random_uuid()',
  })
  readonly id: string;

  @Column({ name: 'username', type: 'varchar' })
  username: string;

  @Column({ name: 'password', type: 'varchar' })
  password: string;

  @OneToMany(() => UserAttempt, (userAttempt: UserAttempt) => userAttempt.user)
  readonly userAttempts: UserAttempt[];

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}
