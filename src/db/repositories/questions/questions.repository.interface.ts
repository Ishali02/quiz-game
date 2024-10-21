import { Questions } from '../../entity/questions.entity';

export const QUESTIONS_REPOSITORY = 'IQuestionsRepository';

export interface IQuestionsRepository {
  getQuestions(limit: number): Promise<Questions[]>;

  getAnswerForQuestionById(id: string): Promise<number>;
}
