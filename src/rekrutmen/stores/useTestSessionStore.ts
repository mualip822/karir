import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { testRepository } from '../repositories/testRepository';
import { candidateTestRepository } from '../repositories/candidateTestRepository';
import type { QuestionWithOptions, TestResult, AttemptWithTest } from '../types/test.types';
import { useRouter } from 'vue-router';

export const useTestSessionStore = defineStore('testSession', () => {

  const router = useRouter();

  const currentAttempt = ref<AttemptWithTest | null>(null);
  const questions = ref<QuestionWithOptions[]>([]);
  const result = ref<TestResult | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const answeredCount = computed(() => 0);

  async function startTest(testId: string) {
    loading.value = true;
    error.value = null;

    try {
      const attemptId = await testRepository.startTest(testId);
      router.push(`/user/test/kerjakan/${attemptId}`);
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function fetchAttemptQuestions(attemptId: string) {
    loading.value = true;
    error.value = null;

    try {
      const attempt = await candidateTestRepository.getAttemptById(attemptId);
      currentAttempt.value = attempt;

      const qs = await candidateTestRepository.getAttemptQuestions(attemptId);
      questions.value = qs; // ✅ FIX: langsung array
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function saveAnswer(payload: any) {
  console.log("========== STORE SAVE ANSWER ==========");
  console.log(payload);

  try {
    const res = await testRepository.saveAnswer(payload);

    console.log("STORE SUCCESS");
    console.log(res);

    return res;
  } catch (err: any) {
    console.error("STORE ERROR");
    console.error(err);

    error.value = err.message;
    throw err;
  }
}
  async function saveAudioAnswer(formData: FormData) {
    try {
      await testRepository.saveAudioAnswer(formData);
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  }

  async function submitTest(attemptId: string) {
    loading.value = true;
    error.value = null;

    try {
      await testRepository.submitTest(attemptId);
      router.push(`/user/test/result/${attemptId}`);
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function fetchScore(attemptId: string) {
    loading.value = true;
    error.value = null;

    try {
      const res = await candidateTestRepository.getAttemptScore(attemptId);
      result.value = res;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  return {
    currentAttempt,
    questions,
    result,
    loading,
    error,
    answeredCount,
    startTest,
    fetchAttemptQuestions,
    saveAnswer,
    saveAudioAnswer,
    submitTest,
    fetchScore,
  };
});