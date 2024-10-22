import {
  Inject,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SubmitQuizResponse } from './dto/submit-quiz.response.dto';
import {
  IResultsRepository,
  RESULTS_REPOSITORY,
} from '../db/repositories/results/results.repository.interface';
import { SubmitQuizRequestDto } from './dto/submit-quiz-request.dto';
import { UserAttempt } from '../db/entity/user-attempt.entity';
import { UserAttemptStatusEnum } from '../db/enums/user-attempt-status.enum';
import { User } from '../db/entity/user.entity';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../db/repositories/user/user.repository.interface';
import { UserDetails } from '../auth/dto/userDetails.dto';
import { UserResultResponse } from './dto/user-result-response.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @Inject(RESULTS_REPOSITORY)
    private resultsRepository: IResultsRepository,
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
  ) {}

  public async submitQuizForUser(
    params: SubmitQuizRequestDto,
    userId: string,
  ): Promise<SubmitQuizResponse> {
    this.logger.log(`Saving Quiz..`);
    await this.validateQuizIsSubmitted(params, userId);
    return await this.resultsRepository.submitQuizForUser(
      params,
      userId,
    );
  }

  public async getAllResultsForUser(
    userId: string,
  ): Promise<UserResultResponse[]> {
    const userResults: UserAttempt[] =
      await this.resultsRepository.getAllResultsByUserId(userId);
    const results: UserResultResponse[] = [];
    userResults.map((userResult) => {
      if (userResult.status === UserAttemptStatusEnum.COMPLETED) {
        results.push({
          quizId: userResult.quizId,
          attemptNo: userResult.attemptNo,
          score: userResult.score,
        });
      }
    });
    return results;
  }

  public async saveQuizForUser(
    params: SubmitQuizRequestDto,
    userId: string,
  ): Promise<void> {
    this.logger.log(`Saving Quiz..`);
    await this.validateQuizIsSubmitted(params, userId);
    return await this.resultsRepository.saveQuizForUser(params, userId);
  }
  private async validateQuizIsSubmitted(params: SubmitQuizRequestDto, userId: string): Promise<void> {
    const quizDetails: UserAttempt =
      await this.resultsRepository.getUserQuizDetails(params, userId);
    if (quizDetails.status === UserAttemptStatusEnum.COMPLETED) {
      this.logger.error(`Quiz is already submitted`);
      throw new UnprocessableEntityException(
        'Quiz cannot be saved/submitted after submitting',
      );
    }
  }
  public async create(user: UserDetails): Promise<User> {
    return await this.userRepository.createUser(user);
  }

  public async findByUsername(username: string): Promise<User | undefined> {
    return await this.userRepository.findByUsername(username);
  }
}
