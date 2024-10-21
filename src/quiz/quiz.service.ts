import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  IQuizRepository,
  QUIZ_REPOSITORY,
} from '../db/repositories/quiz/quiz.repository.interface';
import { Quiz } from '../db/entity/quiz.entity';
import {
  IQuestionsRepository,
  QUESTIONS_REPOSITORY,
} from '../db/repositories/questions/questions.repository.interface';
import { Questions } from '../db/entity/questions.entity';
import { QuizResponseDto } from './dto/quiz-response.dto';
import { QuestionResponse } from './dto/question-response.dto';
import { CreateQuizResponseDto } from './dto/create-quiz-response.dto';
import {
  IResultsRepository,
  RESULTS_REPOSITORY,
} from '../db/repositories/results/results.repository.interface';
import {
  QuestionBodyDto,
  questionPathParamsDto,
} from './dto/question-path-param.dto';
import { Answer } from '../shared/constants';
import { UserAttempt } from '../db/entity/user-attempt.entity';
import { UserAttemptStatusEnum } from '../db/enums/user-attempt-status.enum';

@Injectable()
export class QuizService {
  private readonly logger = new Logger(QuizService.name);
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private quizRepository: IQuizRepository,
    @Inject(QUESTIONS_REPOSITORY)
    private questionsRepository: IQuestionsRepository,
    @Inject(RESULTS_REPOSITORY)
    private resultsRepository: IResultsRepository,
  ) {}

  public async getAllQuiz(): Promise<Quiz[]> {
    return this.quizRepository.getAllQuiz();
  }

  public async getQuizById(
    id: string,
    userId: string,
  ): Promise<QuizResponseDto> {
    this.logger.log(`Retrieving quiz with id ${id}`);
    const quiz: Quiz = await this.quizRepository.getQuizWithQuestionsById(id);
    const questionIds: string[] = quiz.questions.map((question) => question.id);
    this.logger.log(`Update the user_result for the quiz ${id}`);
    const result: UserAttempt =
      await this.resultsRepository.updateTheStatusOfQuizForUser(
        quiz.id,
        userId,
        questionIds,
      );
    return {
      id: id,
      questions: quiz.questions.map((que) => {
        const { text, id, options } = que;
        return { id, text, options };
      }),
      attempt: result.attemptNo,
      answers: result.answers,
    };
  }

  public async registerQuiz(title: string): Promise<CreateQuizResponseDto> {
    this.logger.log(`Create a new quiz with title ${title}`);
    const addQuestionsForQuiz: Questions[] =
      await this.questionsRepository.getQuestions(5);
    const quiz = await this.quizRepository.registerQuiz(
      title,
      addQuestionsForQuiz,
    );
    return { id: quiz.id, title };
  }

  public async getAnswerForQuestionById(
    params: questionPathParamsDto,
    userId: string,
    body: QuestionBodyDto,
  ): Promise<QuestionResponse> {
    const { quizId, questionId } = params;
    const userQuizAttempt: UserAttempt =
      await this.resultsRepository.getUserQuizDetails(
        { attemptNo: body.attemptNo, quizId: params.quizId },
        userId,
      );
    this.logger.log(`Validate if quiz is in progress`);
    if (userQuizAttempt.status !== UserAttemptStatusEnum.INPROGRESS) {
      throw new NotFoundException(`Quiz not found`);
    }
    const answerByUser: Answer = {
      questionId: params.questionId,
      answer: body.selectedOption,
    };
    const isCorrectAnswer: boolean = await this.validateAnswerPassedByUser(
      userQuizAttempt,
      params,
      userId,
      body,
    );
    await this.resultsRepository.updateScoreOfUser(
      quizId,
      userId,
      answerByUser,
      isCorrectAnswer,
      body.attemptNo,
    );
    return {
      questionId,
      selectedOption: body.selectedOption,
      isCorrect: isCorrectAnswer,
    };
  }

  private async validateAnswerPassedByUser(
    userQuizAttempt: UserAttempt,
    params: questionPathParamsDto,
    userId: string,
    body: QuestionBodyDto,
  ) {
    this.logger.log(`Validate if question is present in quiz`);
    if (!userQuizAttempt.answers[params.questionId]) {
      this.logger.error(`QuestionId not found: ${params.questionId}`);
      throw new NotFoundException('Question not fund in quiz');
    }
    this.logger.log(`Validate if user has already submitted the answer`);
    if (userQuizAttempt.answers[params.questionId] !== -1) {
      this.logger.error(`User has already submitted the ans for question`);
      throw new ForbiddenException('User has already submitted the answer');
    }
    this.logger.log(
      `Validate the answer for question for the user: ${userId} `,
    );

    const correctAnswer: number =
      await this.questionsRepository.getAnswerForQuestionById(
        params.questionId,
      );

    return body.selectedOption === correctAnswer;
  }
}
