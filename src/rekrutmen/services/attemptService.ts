import { attemptRepository } from '../repositories/attemptRepository';

export const attemptService = {

  async getCandidateTests() {
    const res = await attemptRepository.getCandidateTests();
    return res;
  },

  async start(testId: string) {
    const res = await attemptRepository.start(testId);
    return res; // sudah ID langsung
  },

  async submit(attemptId: string) {
    const res = await attemptRepository.submit(attemptId);
    return res;
  },

  async saveAnswer(payload: any) {
    const res = await attemptRepository.saveAnswer(payload);
    return res;
  },

};