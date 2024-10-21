import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Quiz } from '../../entity/quiz.entity';
import { IQuizRepository } from './quiz.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Questions } from '../../entity/questions.entity';

@Injectable()
export class QuizRepository
  extends Repository<Quiz>
  implements IQuizRepository
{
  private readonly logger = new Logger(QuizRepository.name);
  constructor(
    @InjectRepository(Quiz)
    private repository: Repository<Quiz>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  public async getAllQuiz(): Promise<Quiz[]> {
    return await this.repository.find();
  }

  public async getQuizWithQuestionsById(id: string): Promise<Quiz> {
    try {
      return await this.repository.findOneOrFail({
        where: { id },
        relations: ['questions'],
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        this.logger.error(`Quiz not found for id: ${id}`);
        throw new NotFoundException('Quiz not found');
      }
      throw new InternalServerErrorException('Internal server error occurred');
    }
  }

  public async registerQuiz(
    title: string,
    questions: Questions[],
  ): Promise<Quiz> {
    const quiz: Quiz = new Quiz(title);
    quiz.questions = questions;
    return this.repository.save(quiz);
  }
}
