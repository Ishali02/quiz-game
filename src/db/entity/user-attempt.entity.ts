import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserAttemptStatusEnum } from '../enums/user-attempt-status.enum';
import { User } from './user.entity';
import { Quiz } from './quiz.entity';

@Entity('user_attempt')
export class UserAttempt {
  @PrimaryColumn({
    name: 'user_id',
    type: 'uuid',
  })
  readonly userId: string;

  @PrimaryColumn({
    name: 'quiz_id',
    type: 'uuid',
  })
  readonly quizId: string;

  @PrimaryColumn({
    name: 'attempt_no',
    type: 'int',
  })
  readonly attemptNo: number;

  @Column({ name: 'score', type: 'int', default: 0 })
  score: number;

  @Column({ name: 'answers', type: 'jsonb' })
  answers: { [key: string]: number };

  @Column({ name: 'status', default: UserAttemptStatusEnum.INPROGRESS })
  status: UserAttemptStatusEnum;

  @Column({ name: 'start_time', default: () => 'now()' })
  readonly startTime: Date;

  @Column({ name: 'end_time', default: null })
  endTime: Date;

  @ManyToOne(() => User, (user: User) => user.userAttempts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  ])
  public user: User;

  @ManyToOne(() => Quiz, (quiz: Quiz) => quiz.userAttempts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'quiz_id',
      referencedColumnName: 'id',
    },
  ])
  public quiz: Quiz;

  constructor(
    quizId: string,
    userId: string,
    addAnswers: { [key: string]: number },
    attemptNo: number,
  ) {
    this.userId = userId;
    this.quizId = quizId;
    this.attemptNo = attemptNo;
    this.answers = addAnswers;
  }
}
