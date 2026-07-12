import { questionRepository } from '../repositories/questionRepository';

export const questionService = {
  async getQuestions(testId: string) {
    return questionRepository.getQuestions(testId);
  },
};