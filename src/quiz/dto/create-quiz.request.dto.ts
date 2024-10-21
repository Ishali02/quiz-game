import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuizRequest {
  @IsString()
  @ApiProperty({ required: true })
  title: string;
}

export class GetQuizPathParamsDto {
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
