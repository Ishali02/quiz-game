import { Quiz } from '../../entity/quiz.entity';
import { Questions } from '../../entity/questions.entity';

export const QUIZ_REPOSITORY = 'IQuizRepository';

export interface IQuizRepository {
  getAllQuiz(): Promise<Quiz[]>;

  registerQuiz(title: string, questions: Questions[]): Promise<Quiz>;

  getQuizWithQuestionsById(id: string): Promise<Quiz>;
}
