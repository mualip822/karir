import * as testService from '../services/testService';

import type {
  Test,
  QuestionWithOptions,
} from '../types/test.types';

export interface ITestRepository {
  getAssignments(): Promise<any[]>;

  getTestById(
    id: string
  ): Promise<Test>;

  getQuestionsByTestId(
    testId: string
  ): Promise<QuestionWithOptions[]>;

  startTest(
    testId: string
  ): Promise<{ id: string }>;

  submitTest(
    attemptId: string
  ): Promise<any>;

  saveAnswer(
    payload: {
      attempt_id: string;
      question_id: string;
      selected_option_id?: string;
      answer_text?: string;
    }
  ): Promise<any>;

  saveAudioAnswer(
    formData: FormData
  ): Promise<any>;
}

class TestRepository
  implements ITestRepository {

  async getAssignments(): Promise<any[]> {
    return await testService.getAssignments();
  }

  async getTestById(
    id: string
  ): Promise<Test> {
    return await testService.getTestById(
      id
    );
  }

  async getQuestionsByTestId(
    testId: string
  ): Promise<QuestionWithOptions[]> {
    return await testService.getQuestionsByTestId(
      testId
    );
  }

  async startTest(
    testId: string
  ): Promise<{ id: string }> {
    return await testService.startTest(
      testId
    );
  }

  async submitTest(
    attemptId: string
  ): Promise<any> {
    return await testService.submitTest(
      attemptId
    );
  }

  async saveAnswer(
    payload: {
      attempt_id: string;
      question_id: string;
      selected_option_id?: string;
      answer_text?: string;
    }
  ): Promise<any> {
    return await testService.saveAnswer(
      payload
    );
  }

  async saveAudioAnswer(
    formData: FormData
  ): Promise<any> {
    return await testService.saveAudioAnswer(
      formData
    );
  }
}

export const testRepository =
  new TestRepository();