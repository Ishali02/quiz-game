import { User } from '../../entity/user.entity';
import { UserDetails } from '../../../auth/dto/userDetails.dto';

export const USER_REPOSITORY = 'IUserRepository';
export interface IUserRepository {
  createUser(user: UserDetails): Promise<User>;
  findByUsername(username: string): Promise<User>;
}
