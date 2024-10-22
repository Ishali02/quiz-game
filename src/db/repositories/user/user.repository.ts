import { EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
import { User } from '../../entity/user.entity';
import { IUserRepository } from './user.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDetails } from '../../../auth/dto/userDetails.dto';
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

export class UserRepository
  extends Repository<User>
  implements IUserRepository
{
  private readonly logger = new Logger(UserRepository.name);
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  public async createUser(userDetails: UserDetails): Promise<User> {
    try {
      const user: User = new User(userDetails.username, userDetails.password);
      return await this.repository.save(user);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError.code === '23505'
      ) {
        this.logger.error(
          `User already exists with  name: ${userDetails.username}`,
        );
        throw new ConflictException('Username already exists');
      }
      throw new InternalServerErrorException('Internal server error occurred');
    }
  }

  public async findByUsername(username: string): Promise<User> {
    try {
      return await this.repository.findOneOrFail({
        where: { username },
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        this.logger.error(`User not found with name: ${username}`);
        throw new NotFoundException('User not found');
      }
      throw new InternalServerErrorException('Internal server error occurred');
    }
  }
}
