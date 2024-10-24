import { IsNotEmpty, IsNumber, IsUUID, Max, Min } from 'class-validator';
import { GetQuizPathParamsDto } from './create-quiz.request.dto';
import { ApiProperty } from '@nestjs/swagger';

export class questionPathParamsDto extends GetQuizPathParamsDto {
  @IsUUID(undefined, {
    each: true,
    message: 'questionId must be valid uuid',
  })
  @IsNotEmpty({
    always: true,
    message: 'questionId must not be empty',
  })
  questionId: string;
}

export class QuestionBodyDto {
  @IsNumber()
  @ApiProperty({ required: true })
  @Min(1)
  @Max(4)
  selectedOption: number;

  @IsNumber()
  @ApiProperty({ required: true })
  attemptNo: number;
}
