import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { getUserIdFromHeaders, Routes } from '../shared/constants';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { SubmitQuizRequestDto } from './dto/submit-quiz-request.dto';
import { UserResultResponse } from './dto/user-result-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubmitQuizResponse } from './dto/submit-quiz.response.dto';

@ApiTags('User')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller(`${Routes.SERVICE_PREFIX}/user`)
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Post('/result/quiz/:quizId/attempt/:attemptNo/submit')
  @ApiOperation({ summary: 'Submit the quiz' })
  @ApiAcceptedResponse({
    description: 'Returns the result of quiz for the user',
  })
  @ApiInternalServerErrorResponse({
    description: 'Returns an error if internal server error occurred',
  })
  @ApiParam({ name: 'quizId', type: String, required: true })
  @ApiParam({ name: 'attemptNo', type: Number, required: true })
  @HttpCode(HttpStatus.OK)
  public async getResultOfQuizForUser(
    @Param() params: SubmitQuizRequestDto,
    @getUserIdFromHeaders() userId: string,
  ): Promise<SubmitQuizResponse> {
    return await this.userService.getResultOfQuizForUser(params, userId);
  }

  @Put('/result/quiz/:quizId/attempt/:attemptNo/save')
  @ApiOperation({ summary: 'Save the quiz' })
  @ApiAcceptedResponse({
    description: 'Save quiz for the user',
  })
  @ApiInternalServerErrorResponse({
    description: 'Returns an error if internal server error occurred',
  })
  @ApiParam({ name: 'quizId', type: String, required: true })
  @ApiParam({ name: 'attemptNo', type: Number, required: true })
  @HttpCode(HttpStatus.OK)
  public async saveQuizForUser(
    @Param() params: SubmitQuizRequestDto,
    @getUserIdFromHeaders() userId: string,
  ): Promise<void> {
    await this.userService.saveQuizForUser(params, userId);
  }

  @Get('/results')
  @ApiOperation({ summary: 'Get all the quiz results' })
  @ApiAcceptedResponse({
    description: 'Returns all the scores of the quiz results',
  })
  @HttpCode(HttpStatus.OK)
  public async getAllResultsForUser(
    @getUserIdFromHeaders() userId: string,
  ): Promise<UserResultResponse[]> {
    return await this.userService.getAllResultsForUser(userId);
  }
}
