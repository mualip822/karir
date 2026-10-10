/* ============================================================
   MESSAGE SERVICE
   - Fetch API layer
============================================================ */

import { useAuthStore } from '../../auth/stores/useAuthStore';
import type { Message } from '../types/message.types';

const BASE_URL = import.meta.env.VITE_API_URL;

/* ------------------------------------------------------------
   REQUEST HELPER
------------------------------------------------------------ */
async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
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

  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.log('API ERROR:', data);
    throw new Error(data?.message ?? 'Request gagal');
  }

  return data as T;
}

/* ------------------------------------------------------------
   GET MESSAGES
------------------------------------------------------------ */
export async function getMessages(): Promise<Message[]> {
  const res = await request<{
    success: boolean;
    data: Message[];
  }>('/rekrutmen/messages', {
    method: 'GET',
  });

  return res.data ?? [];
}

/* ------------------------------------------------------------
   MARK AS READ
------------------------------------------------------------ */
export async function markAsRead(id: string): Promise<void> {
  await request(`/rekrutmen/messages/${id}/read`, {
    method: 'PATCH',
  });
}