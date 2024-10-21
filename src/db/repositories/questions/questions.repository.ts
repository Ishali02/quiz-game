import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Questions } from '../../entity/questions.entity';
import { IQuestionsRepository } from './questions.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class QuestionsRepository
  extends Repository<Questions>
  implements IQuestionsRepository
{
  constructor(
    @InjectRepository(Questions)
    private repository: Repository<Questions>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  public async getQuestions(limit: number): Promise<Questions[]> {
    return await this.repository.query(
      'SELECT * FROM question ORDER BY RANDOM() LIMIT $1',
      [limit],
    );
  }

  public async getAnswerForQuestionById(id: string): Promise<number> {
    const question: Questions = await this.repository.findOneByOrFail({ id });
    return question.correctOption;
  }
}
