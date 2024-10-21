import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QUIZ_REPOSITORY } from './repositories/quiz/quiz.repository.interface';
import { QuizRepository } from './repositories/quiz/quiz.repository';
import { Quiz } from './entity/quiz.entity';
import { Questions } from './entity/questions.entity';
import { User } from './entity/user.entity';
import { UserAttempt } from './entity/user-attempt.entity';
import { QUESTIONS_REPOSITORY } from './repositories/questions/questions.repository.interface';
import { QuestionsRepository } from './repositories/questions/questions.repository';
import { RESULTS_REPOSITORY } from './repositories/results/results.repository.interface';
import { ResultsRepository } from './repositories/results/results.repository';
import { USER_REPOSITORY } from './repositories/user/user.repository.interface';
import { UserRepository } from './repositories/user/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, Questions, User, UserAttempt])],
  providers: [
    {
      provide: QUIZ_REPOSITORY,
      useClass: QuizRepository,
    },
    {
      provide: QUESTIONS_REPOSITORY,
      useClass: QuestionsRepository,
    },
    {
      provide: RESULTS_REPOSITORY,
      useClass: ResultsRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [
    QUIZ_REPOSITORY,
    QUESTIONS_REPOSITORY,
    RESULTS_REPOSITORY,
    USER_REPOSITORY,
  ],
})
export class DatabaseModule {}
