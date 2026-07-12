import { useAuthStore } from '../../auth/stores/useAuthStore';

const BASE_URL = 'http://localhost:3000/api';

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

  const text = await response.text();

  let data: any;

  try {
    data = JSON.parse(text);
  } catch {
    console.error("Response bukan JSON:", text);
    throw new Error("Server mengembalikan response yang bukan JSON.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
export const attemptRepository = {

  async getCandidateTests() {
    return request<any>('/candidate/tests');
  },

  async start(testId: string) {
    const res = await request<{
      success: boolean;
      data: { id: string };
    }>('/tests/start', {
      method: 'POST',
      body: JSON.stringify({ test_id: testId }),
    });

    return res.data; // <- RETURN ID LANGSUNG
  },

  async submit(attemptId: string) {
    const res = await request<{
      success: boolean;
      data: any;
    }>('/tests/submit', {
      method: 'POST',
      body: JSON.stringify({ attempt_id: attemptId }),
    });

    return res.data;
  },

  async saveAnswer(payload: any) {
    const res = await request<{
      success: boolean;
      data: any;
    }>('/tests/answer', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return res.data;
  },
};