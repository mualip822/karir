import { useAuthStore } from '../../auth/stores/useAuthStore';
import type { AttemptWithTest, TestResult, QuestionWithOptions, TestWithAssignment } from '../types/test.types';

const BASE_URL = import.meta.env.VITE_API_URL;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const authStore = useAuthStore();
  const token = authStore.token;
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options?.headers || {}),
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export async function getAssignmentByMessage(messageId: string) {
  const res = await request<{ success: boolean; data: TestWithAssignment }>(`/candidate/messages/${messageId}/assignment`);
  return res.data;
}

export async function getAttemptById(attemptId: string) {
  const res = await request<{ success: boolean; data: AttemptWithTest }>(`/candidate/attempts/${attemptId}`);
  return res.data;
}

export async function getAttemptQuestions(attemptId: string) {
  const res = await request<{ success: boolean; data: QuestionWithOptions[] }>(`/candidate/attempts/${attemptId}/questions`);
  return res.data;
}

export async function getAttemptScore(attemptId: string) {
  const res = await request<{ success: boolean; data: TestResult }>(`/candidate/attempts/${attemptId}/score`);
  return res.data;
}