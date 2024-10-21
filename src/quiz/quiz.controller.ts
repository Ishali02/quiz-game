import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { getUserIdFromHeaders, Routes } from '../shared/constants';
import { Quiz } from '../db/entity/quiz.entity';
import { QuizService } from './quiz.service';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { QuizResponseDto } from './dto/quiz-response.dto';
import {
  CreateQuizRequest,
  GetQuizPathParamsDto,
} from './dto/create-quiz.request.dto';
import {
  QuestionBodyDto,
  questionPathParamsDto,
} from './dto/question-path-param.dto';
import { QuestionResponse } from './dto/question-response.dto';
import { CreateQuizResponseDto } from './dto/create-quiz-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Quiz')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller(`${Routes.SERVICE_PREFIX}/`)
export class QuizController {
  private readonly logger = new Logger(QuizController.name);
  constructor(private readonly quizService: QuizService) {}

  @Get('/quiz')
  @ApiOperation({ summary: 'Get all quizzes' })
  @ApiAcceptedResponse({ description: 'Get all quizzes' })
  @ApiInternalServerErrorResponse({
    description: 'Returns an error if internal server error occurred',
  })
  @HttpCode(HttpStatus.OK)
  public async getAllQuiz(): Promise<Quiz[]> {
    return this.quizService.getAllQuiz();
  }

  @Get('/quiz/:quizId')
  @ApiOperation({ summary: 'Get quiz by Id' })
  @ApiAcceptedResponse({ description: 'Get quizzes by providing id' })
  @ApiInternalServerErrorResponse({
    description: 'Returns an error if internal server error occurred',
  })
  @ApiParam({ name: 'quizId', type: String, required: true })
  @HttpCode(HttpStatus.OK)
  public async getQuizById(
    @Param() params: GetQuizPathParamsDto,
    @getUserIdFromHeaders() userId: string,
  ): Promise<QuizResponseDto> {
    return await this.quizService.getQuizById(params.quizId, userId);
  }

  @Post('/quiz')
  @ApiOperation({ summary: 'Create a quiz' })
  @ApiAcceptedResponse({ description: 'Created a quiz' })
  @ApiInternalServerErrorResponse({
    description: 'Returns an error if internal server error occurred',
  })
  @HttpCode(HttpStatus.CREATED)
  public async registerQuiz(
    @Body() req: CreateQuizRequest,
  ): Promise<CreateQuizResponseDto> {
    return await this.quizService.registerQuiz(req.title);
  }

  @Post('quiz/:quizId/questions/:questionId/answers')
  @ApiOperation({ summary: 'Submit the answer for the question in quiz' })
  @ApiAcceptedResponse({ description: 'Got the answer for the question' })
  @ApiInternalServerErrorResponse({
    description: 'Returns an error if internal server error occurred',
  })
  @ApiParam({ name: 'quizId', type: String, required: true })
  @ApiParam({ name: 'questionId', type: String, required: true })
  @HttpCode(HttpStatus.OK)
  public async getAnswerForQuestion(
    @Param() params: questionPathParamsDto,
    @Body() body: QuestionBodyDto,
    @getUserIdFromHeaders() userId: string,
  ): Promise<QuestionResponse> {
    return await this.quizService.getAnswerForQuestionById(
      params,
      userId,
      body,
    );
  }
}
