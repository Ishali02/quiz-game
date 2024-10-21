import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { datasetTest } from './sql/dataset-test';
import { QuizModule } from '../src/quiz/quiz.module';
import { resetDatabase } from './sql/db';
import * as request from 'supertest';

describe('User Controller', () => {
  let app: INestApplication;
  let module: TestingModule;
  let authService: AuthService;
  let token = {};

  async function generateToken() {
    const token = await authService.login(datasetTest.user[0]);
    return token.accessToken;
  }
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule, QuizModule],
      controllers: [],
      providers: [],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    authService = module.get<AuthService>(AuthService);
    await app.init();
    await resetDatabase();
    expect(module).toBeDefined();
    token = await generateToken();
  });

  it('User submits quiz successfully - returns 200', async () => {
    const res = await request(app.getHttpServer())
      .post(
        `/quiz-game/user/result/quiz/${datasetTest.quiz[0].id}/attempt/1/submit`,
      )
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.hasOwnProperty('quizId')).toBe(true);
    expect(res.body.hasOwnProperty('userId')).toBe(true);
    expect(res.body.hasOwnProperty('score')).toBe(true);
    expect(res.body.hasOwnProperty('answers')).toBe(true);
  });

  it('User submits quiz - Returns 400 for invalid quiz', async () => {
    await request(app.getHttpServer())
      .post(`/quiz-game/user/result/quiz/quiz123/attempt/1/submit`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });
  it('User submits quiz - Returns 401 for missing token', async () => {
    await request(app.getHttpServer())
      .post(
        `/quiz-game/user/result/quiz/${datasetTest.quiz[0].id}/attempt/1/submit`,
      )
      .expect(401);
  });
  it('User submits quiz - Returns 404 for invalid attemptNo', async () => {
    await request(app.getHttpServer())
      .post(
        `/quiz-game/user/result/quiz/${datasetTest.quiz[0].id}/attempt/4/submit`,
      )
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
  it('User submits quiz - Returns 404 for invalid quiz', async () => {
    await request(app.getHttpServer())
      .post(
        `/quiz-game/user/result/quiz/111e8400-e29b-41d4-a716-446655440003/attempt/1/submit`,
      )
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});
