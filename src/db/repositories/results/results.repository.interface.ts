import { Answer } from '../../../shared/constants';
import { UserAttempt } from '../../entity/user-attempt.entity';
import { SubmitQuizResponse } from '../../../user/dto/submit-quiz.response.dto';
import { SubmitQuizRequestDto } from '../../../user/dto/submit-quiz-request.dto';

export const RESULTS_REPOSITORY = 'IResultsRepository';

export interface IResultsRepository {
  updateTheStatusOfQuizForUser(
    quizId: string,
    userId: string,
    questionIds: string[],
  ): Promise<UserAttempt>;

  updateScoreOfUser(
    quizId: string,
    userId: string,
    answer: Answer,
    isCorrectAnswer: boolean,
    attemptNo: number,
  ): Promise<UserAttempt>;

  submitResultOfQuizForUser(
    params: SubmitQuizRequestDto,
    userId: string,
  ): Promise<SubmitQuizResponse>;

  saveQuizForUser(params: SubmitQuizRequestDto, userId: string): Promise<void>;

  getUserQuizDetails(
    params: SubmitQuizRequestDto,
    userId: string,
  ): Promise<UserAttempt>;

  getAllResultsByUserId(userId: string): Promise<UserAttempt[]>;
}
