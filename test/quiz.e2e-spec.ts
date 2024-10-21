import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { resetDatabase } from './sql/db';
import * as request from 'supertest';
import { AuthService } from '../src/auth/auth.service';
import { datasetTest } from './sql/dataset-test';
import { QuizModule } from '../src/quiz/quiz.module';

describe('QuizController', () => {
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
      imports: [AppModule],
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

  it('Get All Quizzes - Return 200 with  correct auth token', async () => {
    return await request(app.getHttpServer())
      .get(`/quiz-game/quiz`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('Get All Quizzes - Return 401 without token', async () => {
    await request(app.getHttpServer()).get(`/quiz-game/quiz`).expect(401);
  });

  describe('Get Quiz By Id', () => {
    it('Return 200 with  correct auth token', async () => {
      const res = await request(app.getHttpServer())
        .get(`/quiz-game/quiz/${datasetTest.quiz[0].id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(res.body.hasOwnProperty('id')).toBe(true);
      expect(res.body.hasOwnProperty('questions')).toBe(true);
      expect(res.body.hasOwnProperty('attempt')).toBe(true);
      expect(res.body.hasOwnProperty('answers')).toBe(true);
    });

    it('Return 401 without token', async () => {
      await request(app.getHttpServer())
        .get(`/quiz-game/quiz/${datasetTest.quiz[0].id}`)
        .expect(401);
    });

    it('Return 400 for incorrect quizId param', async () => {
      await request(app.getHttpServer())
        .get(`/quiz-game/quiz/123`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });

    it('Return 404 if quizId is not present', async () => {
      await request(app.getHttpServer())
        .get(`/quiz-game/quiz/111e8400-e29b-41d4-a716-446655440003`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('Create Quiz', () => {
    it('Returns 201 for successful creation', async () => {
      const res = await request(app.getHttpServer())
        .post(`/quiz-game/quiz`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Test 1' })
        .expect(201);
      expect(res.body.hasOwnProperty('id')).toBe(true);
      expect(res.body.hasOwnProperty('title')).toBe(true);
    });

    it('Returns 400 if payload is not passed', async () => {
      await request(app.getHttpServer())
        .post(`/quiz-game/quiz`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });
  });

  describe('Submit answer to the question in quiz', () => {
    it('Returns 200 for successful submission to question', async () => {
      const res = await request(app.getHttpServer())
        .post(
          `/quiz-game/quiz/${datasetTest.quiz[0].id}/questions/${datasetTest.quiz[0].questions[0]}/answers`,
        )
        .set('Authorization', `Bearer ${token}`)
        .send({ selectedOption: 2, attemptNo: 1 })
        .expect(200);
      expect(res.body.hasOwnProperty('questionId')).toBe(true);
      expect(res.body.hasOwnProperty('selectedOption')).toBe(true);
      expect(res.body.hasOwnProperty('isCorrect')).toBe(true);
    });

    it('Returns 400 for incorrect questionId', async () => {
      await request(app.getHttpServer())
        .post(
          `/quiz-game/quiz/${datasetTest.quiz[0].id}/questions/que123/answers`,
        )
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Test 1' })
        .expect(400);
    });

    it('Returns 400 for incorrect quizId', async () => {
      await request(app.getHttpServer())
        .post(
          `/quiz-game/quiz/quiz123/questions/${datasetTest.quiz[0].questions[0]}/answers`,
        )
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Test 1' })
        .expect(400);
    });

    it('Returns 400 for invalid payload', async () => {
      await request(app.getHttpServer())
        .post(
          `/quiz-game/quiz/${datasetTest.quiz[0].id}/questions/${datasetTest.quiz[0].questions[0]}/answers`,
        )
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Test 1' })
        .expect(400);
    });

    it('Returns 400 if payload is not passed', async () => {
      await request(app.getHttpServer())
        .post(`/quiz-game/quiz`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });

    it('Returns 404 if invalid quiz is passed', async () => {
      await request(app.getHttpServer())
        .post(
          `/quiz-game/quiz/111e8400-e29b-41d4-a716-446655440003/questions/${datasetTest.quiz[0].questions[0]}/answers`,
        )
        .set('Authorization', `Bearer ${token}`)
        .send({ selectedOption: 2, attemptNo: 1 })
        .expect(404);
    });

    it('Returns 404 if invalid attemptNo is passed', async () => {
      await request(app.getHttpServer())
        .post(
          `/quiz-game/quiz/111e8400-e29b-41d4-a716-446655440003/questions/${datasetTest.quiz[0].questions[0]}/answers`,
        )
        .set('Authorization', `Bearer ${token}`)
        .send({ selectedOption: 2, attemptNo: 10 })
        .expect(404);
    });
    it('Returns 404 if invalid question is passed', async () => {
      await request(app.getHttpServer())
        .post(
          `/quiz-game/quiz/${datasetTest.quiz[0].id}/questions/111e8400-e29b-41d4-a716-446655440003/answers`,
        )
        .set('Authorization', `Bearer ${token}`)
        .send({ selectedOption: 2, attemptNo: 1 })
        .expect(404);
    });
    it('Returns 403 if answer is already submitted', async () => {
      await request(app.getHttpServer())
        .post(
          `/quiz-game/quiz/${datasetTest.quiz[0].id}/questions/${datasetTest.quiz[0].questions[4]}/answers`,
        )
        .set('Authorization', `Bearer ${token}`)
        .send({ selectedOption: 2, attemptNo: 1 })
        .expect(403);
    });
  });
});
