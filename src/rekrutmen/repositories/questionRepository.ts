import { useAuthStore } from '@/auth/stores/useAuthStore';

const API = import.meta.env.VITE_API_URL;

function headers() {
  const auth = useAuthStore();

  return {
    Authorization: `Bearer ${auth.token}`,
  };
}

export const questionRepository = {
  async getQuestions(testId: string) {
    const res = await fetch(
      `${API}/tests/questions?test_id=${testId}`,
      {
        headers: headers(),
      }
    );

    return res.json();
  },
};