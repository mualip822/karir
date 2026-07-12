import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { messageRepository } from '../repositories/messageRepository';
import type { Message } from '../types/message.types';

export const useMessageStore = defineStore('message', () => {
  const messages = ref<Message[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const unreadCount = computed(() =>
    messages.value.filter((m) => !m.is_read).length
  );

  const fetchMessages = async () => {
    loading.value = true;
    error.value = null;
    try {
      messages.value = await messageRepository.getMessages();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Gagal memuat pesan';
      error.value = message;
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const markAsRead = async (id: string) => {
  try {
    await messageRepository.markAsRead(id);

    const msg = messages.value.find(
      (m) => m.id === id
    );

    if (msg) {
      msg.is_read = true;
    }

  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Gagal menandai pesan';

    error.value = message;
    console.error(err);
  }
};

  const getRecentMessages = (limit: number = 3): Message[] => {
    return [...messages.value]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, limit);
  };

  return {
    messages,
    loading,
    error,
    unreadCount,
    fetchMessages,
    markAsRead,
    getRecentMessages,
  };
});