import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { UserAttempt } from './user-attempt.entity';
import { Questions } from './questions.entity';

@Entity('quiz')
export class Quiz {
  @PrimaryColumn({
    name: 'id',
    type: 'uuid',
    default: () => 'gen_random_uuid()',
  })
  readonly id: string;

  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @ManyToMany(() => Questions, (question: Questions) => question.quizzes)
  @JoinTable({
    name: 'quiz_questions', // Name of the junction table
    joinColumn: {
      name: 'quiz_id', // Column in the junction table referencing Quiz
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'question_id', // Column in the junction table referencing Question
      referencedColumnName: 'id',
    },
  })
  questions: Questions[];

  @OneToMany(() => UserAttempt, (userAttempt: UserAttempt) => userAttempt.quiz)
  readonly userAttempts: UserAttempt[];

  constructor(title: string) {
    this.title = title;
  }
}
