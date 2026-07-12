import * as candidateTestService from '../services/candidateTestService';
import type {
  AttemptWithTest,
  TestResult,
  QuestionWithOptions
} from '../types/test.types';

export interface ICandidateTestRepository {
  getAssignmentByMessage(messageId: string): Promise<any>;
  getAttemptById(attemptId: string): Promise<AttemptWithTest>;
  getAttemptQuestions(attemptId: string): Promise<QuestionWithOptions[]>;
  getAttemptScore(attemptId: string): Promise<TestResult>;
}

class CandidateTestRepository implements ICandidateTestRepository {

  async getAssignmentByMessage(messageId: string) {
    return candidateTestService.getAssignmentByMessage(messageId);
  }

  async getAttemptById(attemptId: string) {
    return candidateTestService.getAttemptById(attemptId);
  }

  async getAttemptQuestions(attemptId: string) {
  return candidateTestService.getAttemptQuestions(attemptId);
}

  async getAttemptScore(attemptId: string) {
    return candidateTestService.getAttemptScore(attemptId);
  }
}

export const candidateTestRepository = new CandidateTestRepository();