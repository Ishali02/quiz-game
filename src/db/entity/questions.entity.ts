import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { Quiz } from './quiz.entity';

@Entity('question')
export class Questions {
  @PrimaryColumn({
    name: 'id',
    type: 'uuid',
    default: () => 'gen_random_uuid()',
  })
  readonly id: string;

  @Column({ name: 'text', type: 'text' })
  text: string;

  @Column('varchar', { array: true })
  options: string[];

  @Column({ name: 'correct_option', type: 'int' })
  correctOption: number;

  @ManyToMany(() => Quiz, (quiz) => quiz.questions)
  quizzes: Quiz[];

  constructor() {}
}
