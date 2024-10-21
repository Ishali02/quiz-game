import { Questions } from '../../db/entity/questions.entity';

export class QuizResponseDto {
  id: string;
  questions: questions[];
  attempt: number;
  answers: { [key: string]: number };
}

export type questions = Omit<Questions, 'correctOption' | 'quizzes'>;
