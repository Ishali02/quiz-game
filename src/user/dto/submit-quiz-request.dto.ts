import { IsNotEmpty, IsUUID, Validate } from 'class-validator';
import { NumberAllowedValidator } from '../validator/number-allowed.validator';

export class SubmitQuizRequestDto {
  @IsNotEmpty({
    always: true,
    message: 'attemptNo must not be empty',
  })
  @Validate(NumberAllowedValidator)
  attemptNo: number;

  @IsUUID(undefined, {
    each: true,
    message: 'quizId must be valid uuid',
  })
  @IsNotEmpty({
    always: true,
    message: 'quizId must not be empty',
  })
  quizId: string;
}
