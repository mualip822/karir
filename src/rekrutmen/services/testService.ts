import { useAuthStore } from '../../auth/stores/useAuthStore';

import type {
  Test,
  QuestionWithOptions,
} from '../types/test.types';

const BASE_URL = import.meta.env.VITE_API_URL;

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = useAuthStore().token;

  const response = await fetch(
    `${BASE_URL}${path}`,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options?.headers || {}),
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Request failed'
    );
  }

  return data;
}

/**
 * ASSIGNMENT TEST
 */
export async function getAssignments() {
  const res = await request<{
    success: boolean;
    data: any[];
  }>('/candidate/tests');

  return res.data;
}

/**
 * DETAIL TEST
 */
export async function getTestById(
  id: string
): Promise<Test> {
  const res = await request<{
    success: boolean;
    data: Test;
  }>(`/candidate/tests/${id}`);

  return res.data;
}

/**
 * QUESTIONS
 */
export async function getQuestionsByTestId(
  testId: string
): Promise<QuestionWithOptions[]> {
  const res = await request<{
    success: boolean;
    data: QuestionWithOptions[];
  }>(
    `/candidate/tests/${testId}/questions`
  );

  return res.data;
}

/**
 * START TEST
 */
export async function startTest(
  testId: string
): Promise<{ id: string }> {
  const res = await request<{
    success: boolean;
    data: { id: string };
  }>('/tests/start', {
    method: 'POST',
    body: JSON.stringify({
      test_id: testId,
    }),
  });

  return res.data;
}

/**
 * SUBMIT TEST
 */
export async function submitTest(
  attemptId: string
) {
  const res = await request<{
    success: boolean;
    data: any;
  }>('/tests/submit', {
    method: 'POST',
    body: JSON.stringify({
      attempt_id: attemptId,
    }),
  });

  return res.data;
}

/**
 * SAVE ANSWER
 */
export async function saveAnswer(
  payload: {
    attempt_id: string;
    question_id: string;
    selected_option_id?: string;
    answer_text?: string;
  }
) {
  const res = await request<{
    success: boolean;
    data: any;
  }>('/tests/answer', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return res.data;
}

/**
 * SAVE AUDIO
 */
export async function saveAudioAnswer(
  formData: FormData
) {
  const res = await fetch(
    `${BASE_URL}/tests/answer/audio`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${useAuthStore().token}`,
      },
      body: formData,
    }
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      json.message || 'Upload audio gagal'
    );
  }

  return json.data;
}