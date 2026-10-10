<template>
  <div class="msg">

    <!-- ==========================================================
         HEADER
    =========================================================== -->
    <header class="msg-header">
      <div class="msg-header-main">
        <span class="msg-eyebrow">Inbox</span>
        <h1 class="msg-title">Pesan Masuk</h1>
        <p class="msg-subtitle">
          Komunikasi dan informasi terbaru terkait proses lamaran.
          Pesan hanya tampil <strong>24 jam</strong> sejak diterima.
        </p>
      </div>

      <div class="msg-header-meta">
        <span class="chip chip-total">
          <strong>{{ store.recentMessages.length }}</strong>
          <span>Pesan</span>
        </span>
        <span
          v-if="store.unreadCount > 0"
          class="chip chip-unread"
        >
          <span class="chip-dot"></span>
          <strong>{{ store.unreadCount }}</strong>
          <span>Belum dibaca</span>
        </span>
      </div>
    </header>

    <!-- ==========================================================
         LOADING SKELETON
    =========================================================== -->
    <div v-if="store.loading" class="sk-list">
      <div v-for="n in 3" :key="n" class="sk-row">
        <div class="sk sk-avatar"></div>
        <div class="sk-body">
          <div class="sk sk-line w-40"></div>
          <div class="sk sk-line w-80"></div>
          <div class="sk sk-line w-50"></div>
        </div>
        <div class="sk sk-chip"></div>
      </div>
    </div>

    <!-- ==========================================================
         ERROR
    =========================================================== -->
    <div v-else-if="store.error" class="error-box">
      <div class="error-mark">!</div>
      <h3 class="error-title">Gagal memuat pesan</h3>
      <p class="error-desc">{{ store.error }}</p>
      <button
        type="button"
        class="btn btn-secondary"
        @click="store.fetchMessages"
      >
        Coba Lagi
      </button>
    </div>

    <!-- ==========================================================
         EMPTY
    =========================================================== -->
    <div
      v-else-if="store.recentMessages.length === 0"
      class="empty-box"
    >
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
          stroke="currentColor" stroke-width="1.75" stroke-linecap="round"
          stroke-linejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      </div>
      <h3 class="empty-title">Belum ada pesan</h3>
      <p class="empty-desc">
        Pesan dari rekruter akan muncul di sini. Pesan otomatis
        hilang setelah 24 jam.
      </p>
    </div>

    <!-- ==========================================================
         LIST
    =========================================================== -->
    <ul v-else class="msg-list">
      <li
        v-for="message in store.recentMessages"
        :key="message.id"
        class="msg-card"
        :class="{
          'is-unread': !message.is_read,
          'is-open': selectedId === message.id,
        }"
        role="button"
        tabindex="0"
        :aria-expanded="selectedId === message.id"
        @click="handleClick(message)"
        @keydown.enter.prevent="handleClick(message)"
        @keydown.space.prevent="handleClick(message)"
      >
        <!-- HEAD ROW -->
        <div class="msg-row">
          <div class="msg-avatar">
            <span class="msg-avatar-text">{{ initials(message) }}</span>
            <span v-if="!message.is_read" class="msg-unread-dot"></span>
          </div>

          <div class="msg-body">
            <div class="msg-top">
              <span class="msg-subject">{{ message.subject }}</span>
              <span
                class="msg-status"
                :class="message.is_read ? 'is-read' : 'is-new'"
              >
                {{ message.is_read ? 'Dibaca' : 'Baru' }}
              </span>
            </div>

            <p class="msg-preview">{{ preview(message.body) }}</p>
          </div>

          <div class="msg-side">
            <span
              class="msg-expire"
              :class="`tone-${store.expireTone(message.created_at)}`"
            >
              {{ store.expiresIn(message.created_at) }}
            </span>
            <span class="msg-date">
              {{ formatDate(message.created_at) }}
            </span>
            <svg
              class="msg-chev"
              :class="{ 'is-open': selectedId === message.id }"
              viewBox="0 0 24 24" width="14" height="14" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        <!-- EXPANDED DETAIL -->
        <Transition name="expand">
          <div v-if="selectedId === message.id" class="msg-detail">
            <div class="detail-divider"></div>

            <div class="detail-head">
              <span class="detail-label">Isi Pesan</span>
              <span class="detail-time">
                Diterima {{ formatDateFull(message.created_at) }}
              </span>
            </div>

            <p class="detail-body">{{ message.body }}</p>

            <!-- LOADING -->
            <div v-if="loadingAssignment" class="detail-loading">
              <span class="spinner"></span>
              <span>Memuat tes…</span>
            </div>

            <!-- TEST ASSIGNMENT -->
            <div v-else-if="testAssignment" class="test-card">
              <div class="test-card-head">
                <span class="test-eyebrow">Tes Seleksi</span>
                <span
                  class="test-status"
                  :class="getTestStatusClass(testAssignment.assignment.status)"
                >
                  {{ getTestStatusLabel(testAssignment.assignment.status) }}
                </span>
              </div>

              <h4 class="test-title">{{ testAssignment.test.title }}</h4>
              <p class="test-desc">
                {{ testAssignment.test.description ||
                  'Selesaikan tes sesuai instruksi yang diberikan.' }}
              </p>

              <dl class="test-meta">
                <div class="test-meta-item">
                  <dt>Durasi</dt>
                  <dd>{{ testAssignment.test.duration_minutes }} menit</dd>
                </div>
              </dl>

              <div class="test-actions">
                <button
                  v-if="testAssignment.assignment.status !== 'completed'"
                  type="button"
                  class="btn btn-primary"
                  @click.stop="mulaiTest(testAssignment.test.id)"
                >
                  <span>Kerjakan Tes</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>

                <span v-else class="test-done">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                    stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Tes sudah selesai
                </span>
              </div>
            </div>

            <div v-else class="detail-empty">
              Tidak ada tes terkait pesan ini.
            </div>
          </div>
        </Transition>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMessageStore } from '../stores/useMessageStore';
import { candidateTestRepository } from '../repositories/candidateTestRepository';
import { attemptService } from '../services/attemptService';
import type { Message } from '../types/message.types';
import type { TestWithAssignment } from '../types/test.types';

/* ============================================================
   SETUP
============================================================ */
const router = useRouter();
const store = useMessageStore();

const selectedId = ref<string | null>(null);
const loadingAssignment = ref(false);
const testAssignment = ref<TestWithAssignment | null>(null);

/* ============================================================
   HELPERS
============================================================ */
const preview = (text: string): string => {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > 140 ? clean.slice(0, 140) + '…' : clean;
};

const initials = (message: Message): string => {
  // Coba dari subject sebagai fallback
  const text = message.subject || 'P';
  return text.slice(0, 2).toUpperCase() || 'P';
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '-';

  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return 'Baru saja';
  if (diffMin < 60) return `${diffMin}m lalu`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}j lalu`;

  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });
};

const formatDateFull = (dateStr: string): string => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/* ============================================================
   TEST HELPERS
============================================================ */
const getTestStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'Belum dimulai',
    in_progress: 'Sedang dikerjakan',
    completed: 'Selesai',
  };
  return labels[status] || status;
};

const getTestStatusClass = (status: string): string => {
  if (status === 'pending') return 'is-pending';
  if (status === 'in_progress') return 'is-progress';
  if (status === 'completed') return 'is-done';
  return '';
};

/* ============================================================
   ACTIONS
============================================================ */
const handleClick = async (message: Message): Promise<void> => {
  /* Klik pesan yang sama → tutup */
  if (selectedId.value === message.id) {
    selectedId.value = null;
    testAssignment.value = null;
    return;
  }

  selectedId.value = message.id;

  /* Load test assignment */
  try {
    loadingAssignment.value = true;
    const assignment =
      await candidateTestRepository.getAssignmentByMessage(message.id);
    testAssignment.value = assignment;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Assignment gagal dimuat', err);
    testAssignment.value = null;
  } finally {
    loadingAssignment.value = false;
  }

  /* Mark as read */
  if (!message.is_read) {
    await store.markAsRead(message.id);
  }
};

const mulaiTest = async (testId: string): Promise<void> => {
  try {
    const attempt = await attemptService.start(testId);

    // eslint-disable-next-line no-console
    console.log('ATTEMPT:', attempt);

    if (!attempt?.id) {
      throw new Error('Attempt ID tidak ditemukan dari server');
    }

    router.push({
      name: 'kerjakan-test',
      params: { attemptId: attempt.id },
    });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('Gagal memulai test', err);

    const msg = err?.message || '';
    if (msg.includes('sudah dimulai')) {
      alert('Test sudah dimulai, lanjut ke halaman test');
      return;
    }
    alert('Gagal memulai test. Silakan coba lagi.');
  }
};

/* ============================================================
   LIFECYCLE
============================================================ */
onMounted(() => {
  store.fetchMessages();
  store.startAutoRefresh();
});

onBeforeUnmount(() => {
  store.stopAutoRefresh();
});
</script>

<style scoped>
/* ============================================================
   TOKENS
============================================================ */
.msg {
  --primary: #2f6bff;
  --primary-hover: #2457d6;
  --primary-soft: #eef2ff;
  --primary-border: #dbe3ff;

  --success: #16a34a;
  --success-soft: #ecfdf5;

  --warning: #ea580c;
  --warning-soft: #fff7ed;

  --danger: #dc2626;
  --danger-soft: #fef2f2;

  --text: #0d1b2a;
  --text-secondary: #4a5568;
  --text-muted: #8b95a5;
  --text-faint: #a8b0bd;

  --surface: #ffffff;
  --surface-muted: #fafbfd;
  --border: #e5e9ef;
  --border-soft: #eef1f6;

  --r-sm: 6px;
  --r-md: 8px;
  --r-lg: 10px;

  color: var(--text);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, sans-serif;
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11', 'ss01';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 900px;
}

/* ============================================================
   HEADER
============================================================ */
.msg-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 4px 0;
}

.msg-header-main { min-width: 0; }

.msg-eyebrow {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: 6px;
}

.msg-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--text);
}

.msg-subtitle {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  max-width: 520px;
}

.msg-subtitle strong {
  color: var(--primary);
  font-weight: 700;
}

.msg-header-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
}

.chip strong {
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

.chip-unread {
  background: var(--primary-soft);
  border-color: var(--primary-border);
  color: var(--primary);
}

.chip-unread strong {
  color: var(--primary);
}

.chip-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--primary);
}

/* ============================================================
   SKELETON
============================================================ */
.sk-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sk-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
}

.sk {
  background: linear-gradient(90deg, #eef2f7, #f8fafc, #eef2f7);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
  border-radius: var(--r-sm);
}

.sk-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}

.sk-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sk-line { height: 10px; }
.w-40 { width: 40%; }
.w-50 { width: 50%; }
.w-80 { width: 80%; }

.sk-chip {
  width: 60px;
  height: 20px;
  border-radius: 999px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ============================================================
   ERROR & EMPTY
============================================================ */
.error-box,
.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 40px 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
}

.error-box { border-color: var(--danger-soft); }

.error-mark {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--danger-soft);
  color: var(--danger);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
}

.empty-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--surface-muted);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.error-title,
.empty-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}

.error-desc,
.empty-desc {
  margin: 0 0 8px;
  font-size: 12.5px;
  color: var(--text-muted);
  max-width: 360px;
  line-height: 1.5;
}

/* ============================================================
   LIST
============================================================ */
.msg-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ============================================================
   MESSAGE CARD
============================================================ */
.msg-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    box-shadow 0.15s ease;
  overflow: hidden;
  outline: none;
}

.msg-card:hover {
  border-color: #d5dae2;
  background: var(--surface);
}

.msg-card:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.msg-card.is-unread {
  background: linear-gradient(90deg, var(--primary-soft) 0%, var(--surface) 40%);
  border-color: var(--primary-border);
}

.msg-card.is-unread:hover {
  border-color: var(--primary);
}

.msg-card.is-open {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(47, 107, 255, 0.08);
}

/* HEAD ROW */
.msg-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 18px;
}

.msg-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--text);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.msg-avatar-text {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.msg-unread-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--primary);
  border: 2px solid var(--surface);
}

.msg-body {
  flex: 1;
  min-width: 0;
}

.msg-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  min-width: 0;
}

.msg-subject {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.005em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  flex: 1;
}

.msg-status {
  flex-shrink: 0;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 6px;
  white-space: nowrap;
}

.msg-status.is-new {
  background: var(--primary);
  color: #ffffff;
}

.msg-status.is-read {
  background: var(--border-soft);
  color: var(--text-muted);
}

.msg-preview {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}

/* SIDE */
.msg-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
  min-width: 86px;
}

.msg-expire {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.msg-expire.tone-normal {
  background: var(--surface-muted);
  color: var(--text-muted);
  border: 1px solid var(--border);
}

.msg-expire.tone-urgent {
  background: var(--warning-soft);
  color: var(--warning);
}

.msg-expire.tone-expired {
  background: var(--danger-soft);
  color: var(--danger);
}

.msg-date {
  font-size: 11px;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.msg-chev {
  color: var(--text-faint);
  transition: transform 0.2s ease;
}

.msg-chev.is-open {
  transform: rotate(180deg);
}

/* ============================================================
   DETAIL (EXPANDED)
============================================================ */
.msg-detail {
  padding: 0 18px 18px;
  animation: fade-in 0.2s ease;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.detail-divider {
  height: 1px;
  background: var(--border-soft);
  margin-bottom: 16px;
}

.detail-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.detail-label {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.detail-time {
  font-size: 11.5px;
  color: var(--text-faint);
  font-variant-numeric: tabular-nums;
}

.detail-body {
  margin: 0 0 16px;
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--text);
  white-space: pre-wrap;
  word-break: break-word;
}

.detail-empty {
  font-size: 12.5px;
  color: var(--text-muted);
  padding: 10px 0;
}

.detail-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12.5px;
  color: var(--text-muted);
  padding: 10px 0;
}

/* ============================================================
   TEST CARD
============================================================ */
.test-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: var(--surface-muted);
  border: 1px solid var(--border-soft);
  border-radius: var(--r-md);
}

.test-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.test-eyebrow {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary);
  padding: 3px 8px;
  background: var(--primary-soft);
  border: 1px solid var(--primary-border);
  border-radius: 999px;
}

.test-status {
  display: inline-flex;
  align-items: center;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 6px;
  white-space: nowrap;
}

.test-status.is-pending {
  background: var(--primary-soft);
  color: var(--primary);
}

.test-status.is-progress {
  background: var(--warning-soft);
  color: var(--warning);
}

.test-status.is-done {
  background: var(--success-soft);
  color: var(--success);
}

.test-title {
  margin: 0;
  font-size: 14.5px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text);
  line-height: 1.3;
}

.test-desc {
  margin: 0;
  font-size: 12.5px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.test-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 0;
}

.test-meta-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.test-meta-item dt {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.test-meta-item dd {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}

.test-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 4px;
}

.test-done {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--success);
  padding: 8px 14px;
  background: var(--success-soft);
  border-radius: var(--r-md);
}

/* ============================================================
   BUTTONS
============================================================ */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 36px;
  padding: 0 16px;
  border-radius: var(--r-md);
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: -0.005em;
  cursor: pointer;
  border: 1px solid transparent;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.btn-primary {
  background: var(--primary);
  color: #ffffff;
  border-color: var(--primary);
}

.btn-primary:hover {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
}

.btn-secondary {
  background: var(--surface);
  color: var(--text);
  border-color: var(--border);
}

.btn-secondary:hover {
  background: var(--surface-muted);
  border-color: #d5dae2;
}

.btn:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* ============================================================
   SPINNER
============================================================ */
.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ============================================================
   EXPAND TRANSITION
============================================================ */
.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.2s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
}

/* ============================================================
   RESPONSIVE
============================================================ */
@media (max-width: 720px) {
  .msg { gap: 16px; }

  .msg-title { font-size: 20px; }
  .msg-subtitle { font-size: 12.5px; }

  .msg-row {
    padding: 14px;
    gap: 12px;
  }

  .msg-avatar {
    width: 36px;
    height: 36px;
  }
  .msg-avatar-text { font-size: 12px; }

  .msg-side {
    min-width: 0;
    gap: 4px;
  }

  .msg-expire { font-size: 10px; padding: 0 6px; }
  .msg-date { font-size: 10.5px; }

  .msg-detail { padding: 0 14px 16px; }

  .detail-body { font-size: 13px; }

  .test-card { padding: 14px; }
}

@media (max-width: 480px) {
  .msg-card.is-unread {
    background: var(--primary-soft);
  }

  .msg-top { gap: 6px; }
  .msg-subject { font-size: 13.5px; }
  .msg-preview { font-size: 12.5px; }

  .test-actions { justify-content: stretch; }
  .test-actions .btn { width: 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .sk,
  .spinner,
  .msg-card,
  .msg-chev,
  .expand-enter-active,
  .expand-leave-active {
    transition: none;
    animation: none;
  }
}
</style>