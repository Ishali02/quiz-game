import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAttempt } from '../../entity/user-attempt.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { IResultsRepository } from './results.repository.interface';
import { Answer } from '../../../shared/constants';
import { UserAttemptStatusEnum } from '../../enums/user-attempt-status.enum';
import { SubmitQuizResponse } from '../../../user/dto/submit-quiz.response.dto';
import { SubmitQuizRequestDto } from '../../../user/dto/submit-quiz-request.dto';

@Injectable()
export class ResultsRepository
  extends Repository<UserAttempt>
  implements IResultsRepository
{
  private readonly logger = new Logger(ResultsRepository.name);
  constructor(
    @InjectRepository(UserAttempt)
    private repository: Repository<UserAttempt>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  public async updateTheStatusOfQuizForUser(
    quizId: string,
    userId: string,
    questionIds: string[],
  ): Promise<UserAttempt> {
    const [userResultsForQuiz, userAttempts] =
      await this.repository.findAndCountBy({
        quizId,
        userId,
      });
    const answers: { [key: string]: number } = {};
    questionIds.forEach((questionId: string) => {
      answers[questionId] = -1;
    });
    if (
      userAttempts === 0 ||
      userResultsForQuiz[userAttempts - 1].status ===
        UserAttemptStatusEnum.COMPLETED
    ) {
      return await this.createUserResult(
        quizId,
        userId,
        answers,
        userAttempts + 1,
      );
    }
    if (
      userResultsForQuiz[userAttempts - 1].status ===
      UserAttemptStatusEnum.INCOMPLETE
    ) {
      const updateData = {
        status: UserAttemptStatusEnum.INPROGRESS,
      };
      return await this.updateResult(quizId, userId, updateData, userAttempts);
    }
    return userResultsForQuiz[userAttempts - 1];
  }

  public async updateScoreOfUser(
    quizId: string,
    userId: string,
    answer: Answer,
    isCorrectAnswer: boolean,
    attemptNo: number,
  ): Promise<UserAttempt> {
    this.logger.log(
      `Updating the score for the user: ${userId} for quiz: ${quizId} and attempt: ${attemptNo}`,
    );
    const updateData = {
      answers: () =>
        `jsonb_set(answers, '{${answer.questionId}}', '${answer.answer}'::jsonb)`,
    };
    if (isCorrectAnswer) {
      updateData['score'] = () => 'score + 1';
    }
    return await this.updateResult(quizId, userId, updateData, attemptNo);
  }

  public async submitResultOfQuizForUser(
    params: SubmitQuizRequestDto,
    userId: string,
  ): Promise<SubmitQuizResponse> {
    const { quizId, attemptNo } = params;
    const updateData = {
      status: UserAttemptStatusEnum.COMPLETED,
      endTime: new Date().toISOString(),
    };
    const result: UserAttempt = await this.updateResult(
      quizId,
      userId,
      updateData,
      attemptNo,
    );
    const listOfAnswers: number[] = [];
    Object.keys(result.answers).forEach((questionId) => {
      listOfAnswers.push(result.answers[questionId]);
    });
    return {
      quizId: quizId,
      userId: userId,
      score: result.score,
      answers: listOfAnswers,
    };
  }

  public async saveQuizForUser(
    params: SubmitQuizRequestDto,
    userId: string,
  ): Promise<void> {
    const { quizId, attemptNo } = params;
    const updateData = {
      status: UserAttemptStatusEnum.INCOMPLETE,
      endTime: new Date().toISOString(),
    };
    await this.updateResult(quizId, userId, updateData, attemptNo);
  }
  public async getAllResultsByUserId(userId: string): Promise<UserAttempt[]> {
    return await this.repository.find({ where: { userId: userId } });
  }
  public async getUserQuizDetails(
    params: SubmitQuizRequestDto,
    userId: string,
  ): Promise<UserAttempt> {
    try {
      return await this.repository.findOneOrFail({
        where: { quizId: params.quizId, userId, attemptNo: params.attemptNo },
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        this.logger.error(
          `Quiz: ${params.quizId} details not found for user: ${userId}`,
        );
        throw new NotFoundException('Quiz details not found');
      }
      throw new InternalServerErrorException('Internal server error occurred');
    }
  }

  private async createUserResult(
    quizId: string,
    userId: string,
    addAnswers: { [key: string]: number },
    attemptNo?: number,
  ): Promise<UserAttempt> {
    const addUserResult: UserAttempt = new UserAttempt(
      quizId,
      userId,
      addAnswers,
      attemptNo,
    );
    return await this.repository.save(addUserResult);
  }

  private async updateResult(
    quizId: string,
    userId: string,
    updateData: any,
    attemptNo: number,
  ): Promise<UserAttempt> {
    const result = await this.repository
      .createQueryBuilder()
      .update(UserAttempt)
      .set(updateData)
      .where(
        'quiz_id  = :quizId AND user_id  = :userId AND attempt_no = :attemptNo',
        {
          quizId,
          userId,
          attemptNo,
        },
      )
      .returning('*') // This line returns the updated row
      .execute();

    if (result.affected === 0) {
      this.logger.error(`Quiz result for user: ${userId} was not found`);
      throw new NotFoundException('User result not found');
    }

    // Return the updated entity from the result
    return result.raw[0];
  }
}
