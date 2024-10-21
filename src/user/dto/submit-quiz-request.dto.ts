import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class SubmitQuizRequestDto {
  @IsNotEmpty({
    always: true,
    message: 'attemptNo must not be empty',
  })

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
