/* ============================================================
   MESSAGE STORE
   - Filter pesan ≤ 24 jam (reactive, auto-refresh tiap 30s)
============================================================ */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { messageRepository } from '../repositories/messageRepository';
import type { Message } from '../types/message.types';

/* ------------------------------------------------------------
   KONSTANTA — batas umur pesan
------------------------------------------------------------ */
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const useMessageStore = defineStore('message', () => {
  /* ==========================================================
     STATE
  ========================================================== */
  const messages = ref<Message[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /* tick untuk reaktivitas — pesan expired otomatis hilang */
  const tick = ref(Date.now());
  let tickTimer: number | null = null;

  /* ==========================================================
     COMPUTED — pesan ≤ 24 jam, urut terbaru
  ========================================================== */
  const recentMessages = computed<Message[]>(() => {
    const now = tick.value;
    return messages.value
      .filter((m) => {
        const t = new Date(m.created_at).getTime();
        if (Number.isNaN(t)) return false;
        return now - t <= ONE_DAY_MS;
      })
      .sort((a, b) => {
        const ta = new Date(a.created_at).getTime();
        const tb = new Date(b.created_at).getTime();
        return tb - ta;
      });
  });

  /* ==========================================================
     COMPUTED — unread dari pesan ≤ 24 jam saja
  ========================================================== */
  const unreadCount = computed(
    () => recentMessages.value.filter((m) => !m.is_read).length,
  );

  /* ==========================================================
     ACTIONS
  ========================================================== */
  const fetchMessages = async (): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const data = await messageRepository.getMessages();
      messages.value = Array.isArray(data) ? data : [];
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Gagal memuat pesan';
      error.value = msg;
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const markAsRead = async (id: string): Promise<void> => {
    try {
      await messageRepository.markAsRead(id);

      const msg = messages.value.find((m) => m.id === id);
      if (msg) msg.is_read = true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Gagal menandai pesan';
      error.value = message;
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  /* ==========================================================
     AUTO-REFRESH — panggil dari komponen (mount/unmount)
  ========================================================== */
  const startAutoRefresh = (): void => {
    if (tickTimer !== null) return;
    tickTimer = window.setInterval(() => {
      tick.value = Date.now();
    }, 30_000);
  };

  const stopAutoRefresh = (): void => {
    if (tickTimer !== null) {
      window.clearInterval(tickTimer);
      tickTimer = null;
    }
  };

  /* ==========================================================
     HELPER — hitung sisa waktu pesan
  ========================================================== */
  const expiresIn = (iso: string): string => {
    const t = new Date(iso).getTime();
    if (Number.isNaN(t)) return '—';

    const remaining = ONE_DAY_MS - (Date.now() - t);
    if (remaining <= 0) return 'Kedaluwarsa';

    const hours = Math.floor(remaining / 3_600_000);
    const minutes = Math.floor((remaining % 3_600_000) / 60_000);

    if (hours >= 1) return `${hours}j lagi`;
    return `${minutes}m lagi`;
  };

  const expireTone = (iso: string): 'normal' | 'urgent' | 'expired' => {
    const t = new Date(iso).getTime();
    if (Number.isNaN(t)) return 'normal';

    const remaining = ONE_DAY_MS - (Date.now() - t);
    if (remaining <= 0) return 'expired';
    if (remaining < 3 * 60 * 60 * 1000) return 'urgent';
    return 'normal';
  };

  const getRecentMessages = (limit = 3): Message[] => {
    return recentMessages.value.slice(0, limit);
  };

  /* ==========================================================
     RETURN
  ========================================================== */
  return {
    // state
    messages,
    loading,
    error,

    // computed
    recentMessages,
    unreadCount,

    // actions
    fetchMessages,
    markAsRead,
    startAutoRefresh,
    stopAutoRefresh,

    // helpers
    expiresIn,
    expireTone,
    getRecentMessages,
  };
});