<template>
  <div class="test-session" :class="{ 'is-locked': isLocked }">

    <!-- =========================================================
         LOCK WARNING OVERLAY
         ========================================================= -->
    <Transition name="lock">
      <div v-if="showLockWarning" class="lock-overlay" @click.prevent @contextmenu.prevent>
        <div class="lock-card">
          <div class="lock-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          <h2 class="lock-title">Jangan tinggalkan halaman ujian</h2>

          <p class="lock-desc">
            Sistem mendeteksi Anda <strong>keluar dari halaman ujian</strong>.
            Aksi ini tercatat sebagai pelanggaran.
          </p>

          <div class="lock-counter">
            <div class="lock-counter-row">
              <span>Pelanggaran</span>
              <strong :class="{ 'is-danger': violations >= maxViolations - 1 }">
                {{ violations }} / {{ maxViolations }}
              </strong>
            </div>

            <div class="lock-counter-bar">
              <div
                class="lock-counter-fill"
                :class="{ 'is-danger': violations >= maxViolations - 1 }"
                :style="{ width: violationPercent + '%' }"
              ></div>
            </div>
          </div>

          <p v-if="violations >= maxViolations - 1" class="lock-warn">
            ⚠ Pelanggaran berikutnya akan <strong>mengakhiri ujian otomatis</strong>.
          </p>

          <button type="button" class="lock-btn" @click="resumeTest">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Kembali ke Ujian
          </button>
        </div>
      </div>
    </Transition>

    <!-- LOADING -->
    <div v-if="store.loading" class="loading-state">
      <div class="loading-spinner"></div>
      <h2 class="loading-title">Menyiapkan tes Anda</h2>
      <p class="loading-description">Memuat soal dan instruksi...</p>
    </div>

    <!-- ERROR -->
    <div v-else-if="store.error" class="error-state">
      <svg class="error-icon" width="48" height="48" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round">
        <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      </svg>
      <h2 class="error-title">Terjadi kesalahan</h2>
      <p class="error-description">{{ store.error }}</p>
      <button class="retry-btn" type="button" @click="store.fetchAttemptQuestions(attemptId)">
        Coba Lagi
      </button>
    </div>

    <!-- MAIN CONTENT -->
    <div v-else class="session-content">

      <!-- HEADER -->
      <header class="session-header">
        <div class="header-top">
          <div class="title-wrapper">
            <h1 class="test-title">
              {{ store.currentAttempt?.test_title || 'Test Rekrutmen' }}
            </h1>
          </div>

          <span
            v-if="store.currentAttempt?.status"
            class="status-badge"
            :class="getStatusClass(store.currentAttempt.status)"
          >
            {{ getStatusLabel(store.currentAttempt.status) }}
          </span>
        </div>

        <div class="header-meta">
          <div class="meta-item">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
            </svg>
            <span>{{ store.questions.length }} Soal</span>
          </div>

          <div v-if="store.currentAttempt?.test_description" class="meta-item meta-description">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>{{ store.currentAttempt.test_description }}</span>
          </div>

          <div v-if="store.currentAttempt?.duration_minutes" class="meta-item">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{{ store.currentAttempt.duration_minutes }} Menit</span>
          </div>
        </div>

        <div class="security-banner">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>
            Ujian terkunci — jangan berpindah tab, keluar fullscreen,
            atau menutup halaman sebelum submit.
          </span>
        </div>
      </header>

      <!-- QUESTIONS -->
      <div v-if="store.questions.length" class="questions-grid">
        <div v-for="(q, index) in store.questions" :key="q.id" class="question-card">
          <div class="question-number">
            Soal {{ String(index + 1).padStart(2, '0') }}
          </div>

          <p class="question-text">{{ q.question_text }}</p>

          <img
            v-if="q.question_image"
            :src="getImageUrl(q.question_image)"
            class="question-image"
            alt="Gambar pertanyaan"
          />

          <!-- MULTIPLE CHOICE -->
          <div v-if="q.question_type === 'MULTIPLE_CHOICE'" class="options-group">
            <label v-for="(opt, optIndex) in q.options" :key="opt.id" class="option-item">
              <input
                type="radio"
                :name="'q_' + q.id"
                :value="opt.id"
                class="option-radio"
                @change="answerQuestion(q, opt.id)"
              />
              <div class="option-letter">{{ String.fromCharCode(65 + optIndex) }}</div>
              <div class="option-content">
                <img
                  v-if="opt.option_image"
                  :src="getImageUrl(opt.option_image)"
                  class="option-image"
                  alt="Gambar pilihan"
                />
                <span class="option-text">{{ opt.option_text }}</span>
              </div>
            </label>
          </div>

          <!-- ESSAY -->
          <div v-if="q.question_type === 'ESSAY'" class="essay-area">
            <label class="essay-label" :for="'essay-' + q.id">Jawaban Anda</label>
            <textarea
              :id="'essay-' + q.id"
              class="essay-input"
              placeholder="Tulis jawaban Anda di sini..."
              @input="debouncedSaveEssay(q, ($event.target as HTMLTextAreaElement).value)"
            ></textarea>
            <div class="autosave-hint">
              <svg class="hint-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span>Tersimpan otomatis</span>
            </div>
          </div>

          <!-- AUDIO -->
          <div v-if="q.question_type === 'AUDIO'" class="audio-area">
            <div class="audio-placeholder">
              <svg class="waveform-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M2 12h2M6 8v8M10 5v14M14 9v6M18 7v10M22 10v4" />
              </svg>
              <span class="recording-status">Siap merekam</span>
            </div>

            <div class="audio-controls">
              <button class="btn-record" type="button" @click="startRecording">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="6" />
                </svg>
                Rekam
              </button>
              <button class="btn-stop" type="button" @click="stopRecording">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
                Stop
              </button>
              <button class="btn-upload" type="button" @click="uploadAudio(q)">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">?</div>
        <h3>Belum ada soal</h3>
        <p>Soal untuk tes ini belum tersedia.</p>
      </div>

      <!-- SUBMISSION BAR -->
      <div v-if="store.questions.length" class="submission-bar">
        <div class="question-dots">
          <span
            v-for="(q, i) in store.questions"
            :key="q.id"
            class="dot"
            :title="'Soal ' + (i + 1)"
          >
            {{ i + 1 }}
          </span>
        </div>

        <button
          class="submit-btn"
          type="button"
          :disabled="submitting"
          @click="submitTest"
        >
          <svg v-if="submitting" class="btn-spinner" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="spinner-track" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="4" stroke-linecap="round" class="spinner-head" />
          </svg>
          <svg v-else class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12l2 2 4-4" />
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
          </svg>
          <span>{{ submitting ? 'Mengirim...' : 'Selesaikan Test' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue';
import { useRoute } from 'vue-router';

import { useTestSessionStore } from '../stores/useTestSessionStore';
import type { QuestionWithOptions } from '../types/test.types';

const route = useRoute();
const store = useTestSessionStore();

const attemptId = route.params.attemptId as string;
const submitting = ref(false);

/* ============================================================
   🔒 LOCK STATE
============================================================ */
const MAX_VIOLATIONS = 3;

const violations = ref(0);
const showLockWarning = ref(false);
const submitted = ref(false);
const isLocked = computed(() => !submitted.value);

const violationPercent = computed(() =>
  Math.min(100, Math.round((violations.value / MAX_VIOLATIONS) * 100)),
);
const maxViolations = MAX_VIOLATIONS;

/* ============================================================
   API URL
============================================================ */
const rawApiUrl = import.meta.env.VITE_API_URL || '';
const API_URL = rawApiUrl.replace(/\/api\/?$/, '');

const getImageUrl = (path?: string | null) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  const normalized = path.replace(/\\/g, '/');
  return `${API_URL}/${normalized.replace(/^\/+/, '')}`;
};

/* ============================================================
   AUDIO
============================================================ */
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];

/* ============================================================
   🚫 REGISTER VIOLATION
============================================================ */
const registerViolation = (reason: string) => {
  if (submitted.value) return;

  violations.value += 1;
  // eslint-disable-next-line no-console
  console.warn(`[PROCTOR] Violation #${violations.value}: ${reason}`);

  if (violations.value >= MAX_VIOLATIONS) {
    void autoSubmitForViolation();
    return;
  }

  showLockWarning.value = true;
};

/* ============================================================
   ⛔ AUTO SUBMIT
============================================================ */
const autoSubmitForViolation = async () => {
  submitted.value = true;
  showLockWarning.value = false;

  try {
    await store.submitTest(attemptId);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Auto submit error:', err);
  } finally {
    exitLock();
  }
};

/* ============================================================
   ▶ RESUME
============================================================ */
const resumeTest = async () => {
  showLockWarning.value = false;

  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[PROCTOR] Tidak bisa masuk fullscreen:', err);
  }
};

/* ============================================================
   🔒 FULLSCREEN
============================================================ */
const enterFullscreen = async () => {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[PROCTOR] Fullscreen request ditolak:', err);
  }
};

const exitLock = () => {
  submitted.value = true;

  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }

  detachListeners();
};

/* ============================================================
   🎧 HANDLERS
============================================================ */
const handleFullscreenChange = () => {
  if (submitted.value) return;
  if (!document.fullscreenElement) {
    registerViolation('keluar dari fullscreen (ESC / F11)');
  }
};

const handleVisibilityChange = () => {
  if (submitted.value) return;
  if (document.hidden) {
    registerViolation('berpindah tab / minimize');
  }
};

const handleWindowBlur = () => {
  if (submitted.value) return;
  registerViolation('kehilangan fokus window');
};

const handleContextMenu = (e: MouseEvent) => {
  if (submitted.value) return;
  e.preventDefault();
};

const handleCopyPaste = (e: Event) => {
  if (submitted.value) return;
  e.preventDefault();
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (submitted.value) return;

  const k = e.key.toLowerCase();

  /* 🔒 Block ESC — tidak bisa keluar pakai ESC */
  if (e.key === 'Escape' || e.key === 'Esc') {
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  /* Block F11, F12 */
  if (e.key === 'F11' || e.key === 'F12') {
    e.preventDefault();
    return;
  }

  /* Block Ctrl+T, Ctrl+N, Ctrl+W, Ctrl+P, Ctrl+S, Ctrl+U */
  if (e.ctrlKey && ['t', 'n', 'w', 'p', 's', 'u'].includes(k)) {
    e.preventDefault();
    return;
  }

  /* Block Ctrl+Shift+T/N/I/J/C */
  if (e.ctrlKey && e.shiftKey && ['t', 'n', 'i', 'j', 'c'].includes(k)) {
    e.preventDefault();
    return;
  }

  /* Block Alt+F4, Alt+Tab */
  if (e.altKey && (e.key === 'F4' || e.key === 'Tab')) {
    e.preventDefault();
    return;
  }
};

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (submitted.value) return;

  e.preventDefault();
  e.returnValue = '';
  return '';
};

/* 🔒 Block browser back button */
const handlePopState = () => {
  if (submitted.value) return;
  /* Push back state — user tidak bisa balik */
  history.pushState(null, '', location.href);
  registerViolation('mencoba keluar halaman ujian');
};

/* ============================================================
   ATTACH / DETACH
============================================================ */
const attachListeners = () => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('blur', handleWindowBlur);
  window.addEventListener('contextmenu', handleContextMenu);
  document.addEventListener('copy', handleCopyPaste);
  document.addEventListener('cut', handleCopyPaste);
  document.addEventListener('paste', handleCopyPaste);
  document.addEventListener('keydown', handleKeyDown);
  window.addEventListener('beforeunload', handleBeforeUnload);
  window.addEventListener('popstate', handlePopState);
};

const detachListeners = () => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  window.removeEventListener('blur', handleWindowBlur);
  window.removeEventListener('contextmenu', handleContextMenu);
  document.removeEventListener('copy', handleCopyPaste);
  document.removeEventListener('cut', handleCopyPaste);
  document.removeEventListener('paste', handleCopyPaste);
  document.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('beforeunload', handleBeforeUnload);
  window.removeEventListener('popstate', handlePopState);
};

/* ============================================================
   LOAD TEST
============================================================ */
onMounted(async () => {
  await store.fetchAttemptQuestions(attemptId);

  if (!store.error && store.questions.length > 0) {
    await enterFullscreen();

    /* Push history state awal — prevent back button */
    history.pushState(null, '', location.href);

    attachListeners();
  }
});

onBeforeUnmount(() => {
  detachListeners();

  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }
});

/* ============================================================
   MULTIPLE CHOICE
============================================================ */
const answerQuestion = async (
  question: QuestionWithOptions,
  optionId: string,
) => {
  try {
    await store.saveAnswer({
      attempt_id: attemptId,
      question_id: question.id,
      selected_option_id: optionId,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('SAVE ANSWER ERROR', err);
  }
};

/* ============================================================
   ESSAY
============================================================ */
const debouncedSaveEssay = debounce(
  async (question: QuestionWithOptions, text: string) => {
    try {
      await store.saveAnswer({
        attempt_id: attemptId,
        question_id: question.id,
        answer_text: text,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('SAVE ESSAY ERROR', err);
    }
  },
  1000,
);

/* ============================================================
   AUDIO
============================================================ */
const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunks.push(event.data);
    };

    mediaRecorder.start();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('RECORDING ERROR', error);
  }
};

const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
};

const uploadAudio = async (question: QuestionWithOptions) => {
  if (!audioChunks.length) return;

  try {
    const blob = new Blob(audioChunks, { type: 'audio/webm' });
    const formData = new FormData();

    formData.append('attempt_id', attemptId);
    formData.append('question_id', question.id);
    formData.append('audio', blob, 'answer.webm');

    await store.saveAudioAnswer(formData);
    audioChunks = [];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('UPLOAD AUDIO ERROR', error);
  }
};

/* ============================================================
   SUBMIT TEST
============================================================ */
const submitTest = async () => {
  if (submitting.value || submitted.value) return;

  try {
    submitting.value = true;
    await store.submitTest(attemptId);

    submitted.value = true;
    exitLock();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('SUBMIT TEST ERROR', error);
  } finally {
    submitting.value = false;
  }
};

/* ============================================================
   DEBOUNCE
============================================================ */
function debounce(fn: Function, delay: number) {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Belum dimulai',
    in_progress: 'Sedang dikerjakan',
    completed: 'Selesai',
  };
  return labels[status] || status;
};

const getStatusClass = (status: string) => {
  if (status === 'pending') return 'status-pending';
  if (status === 'in_progress') return 'status-progress';
  if (status === 'completed') return 'status-completed';
  return '';
};
</script>

<style scoped>
/* ============================================================
   TOKENS
============================================================ */
.test-session {
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --background: #f8fafc;
  --surface: #ffffff;
  --text: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --border: #e2e8f0;
  --success: #16a34a;
  --warning: #d97706;
  --danger: #dc2626;
  --radius: 16px;
  --radius-sm: 10px;
  --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.04);
  --transition: 0.2s ease-in-out;

  width: 100%;
  max-width: 100%;
  min-width: 0;
  position: relative;
  background: var(--background);
  color: var(--text);
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  min-height: 100vh;
  padding: 32px 20px 140px;
  overflow-x: clip;
  box-sizing: border-box;
}

/* Saat lock — cegah interaksi di luar modal */
.test-session.is-locked {
  user-select: none;
}

/* ============================================================
   🔒 LOCK OVERLAY
============================================================ */
.lock-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(13, 27, 42, 0.72);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  user-select: none;
}

.lock-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border: 1px solid #e5e9ef;
  border-radius: 16px;
  box-shadow: 0 24px 48px -12px rgba(13, 27, 42, 0.32);
  padding: 32px 28px 26px;
  text-align: center;
  font-family: 'Inter', system-ui, sans-serif;
}

.lock-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 18px;
  border-radius: 50%;
  background: #fef3c7;
  color: #b45309;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lock-title {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
  color: #0d1b2a;
  line-height: 1.3;
}

.lock-desc {
  margin: 0 0 20px;
  font-size: 13.5px;
  color: #4a5568;
  line-height: 1.6;
}

.lock-desc strong {
  color: #dc2626;
  font-weight: 700;
}

.lock-counter {
  padding: 14px 16px;
  background: #fafbfd;
  border: 1px solid #eef1f6;
  border-radius: 10px;
  margin-bottom: 16px;
}

.lock-counter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 12.5px;
  color: #8b95a5;
  font-weight: 500;
}

.lock-counter-row strong {
  font-size: 15px;
  font-weight: 700;
  color: #0d1b2a;
  font-variant-numeric: tabular-nums;
}

.lock-counter-row strong.is-danger {
  color: #dc2626;
}

.lock-counter-bar {
  height: 6px;
  background: #eef1f6;
  border-radius: 999px;
  overflow: hidden;
}

.lock-counter-fill {
  height: 100%;
  background: #f59e0b;
  border-radius: 999px;
  transition: width 0.3s ease, background 0.3s ease;
}

.lock-counter-fill.is-danger {
  background: #dc2626;
}

.lock-warn {
  margin: 0 0 16px;
  padding: 10px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  font-size: 12.5px;
  color: #991b1b;
  line-height: 1.5;
  text-align: left;
}

.lock-warn strong {
  color: #dc2626;
}

.lock-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 44px;
  padding: 0 22px;
  border: 1px solid #2f6bff;
  border-radius: 10px;
  background: #2f6bff;
  color: #ffffff;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.lock-btn:hover {
  background: #2457d6;
  border-color: #2457d6;
}

.lock-enter-active,
.lock-leave-active {
  transition: opacity 0.2s ease;
}

.lock-enter-from,
.lock-leave-to {
  opacity: 0;
}

/* ============================================================
   LOADING / ERROR
============================================================ */
.loading-state,
.error-state {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 40px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: test-session-spin 0.8s linear infinite;
  margin-bottom: 20px;
}

.loading-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8px;
}

.loading-description {
  font-size: 14px;
  color: var(--text-secondary);
}

.error-icon {
  color: var(--danger);
  margin-bottom: 20px;
}

.error-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8px;
}

.error-description {
  max-width: 400px;
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--primary);
  color: #ffffff;
  border: none;
  border-radius: var(--radius-sm);
  padding: 12px 24px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}

.retry-btn:hover {
  background: var(--primary-hover);
}

/* ============================================================
   SESSION CONTENT
============================================================ */
.session-content {
  width: 100%;
  max-width: 840px;
  min-width: 0;
  margin: 0 auto;
}

.session-header {
  width: 100%;
  min-width: 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px 28px;
  margin-bottom: 32px;
  box-shadow: var(--shadow-sm);
}

.header-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  min-width: 0;
}

.title-wrapper { min-width: 0; flex: 1; }

.test-title {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--text);
  overflow-wrap: anywhere;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.status-pending { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
.status-progress { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }
.status-completed { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }

.header-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  color: var(--text-secondary);
  font-size: 14px;
  min-width: 0;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.meta-item span { overflow-wrap: anywhere; }
.meta-description { flex: 1 1 300px; }
.meta-icon { width: 18px; height: 18px; flex-shrink: 0; color: var(--primary); }

.security-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  padding: 10px 14px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 10px;
  font-size: 12.5px;
  color: #1e40af;
  line-height: 1.5;
}

.security-banner svg { flex-shrink: 0; color: #2563eb; }

/* ============================================================
   QUESTIONS
============================================================ */
.questions-grid {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.question-card {
  width: 100%;
  min-width: 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px 32px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.question-number {
  display: inline-flex;
  align-items: center;
  background: #f1f5f9;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 4px 12px;
  border-radius: 999px;
  margin-bottom: 16px;
}

.question-text {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.6;
  color: var(--text);
  margin-bottom: 24px;
  overflow-wrap: anywhere;
}

.question-image {
  display: block;
  max-width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: contain;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: #f8fafc;
  margin-bottom: 24px;
}

/* OPTIONS */
.options-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-item {
  width: 100%;
  min-width: 0;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 18px;
  border: 1.5px solid var(--border);
  border-radius: 14px;
  cursor: pointer;
  background: #ffffff;
  position: relative;
  transition: border-color var(--transition), background var(--transition);
}

.option-item:hover {
  border-color: var(--primary);
  background: #f8fafc;
}

.option-radio {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.option-letter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1.5px solid #cbd5e1;
  background: #ffffff;
  font-weight: 600;
  font-size: 14px;
  color: var(--text-secondary);
  flex-shrink: 0;
  transition: all var(--transition);
}

.option-item:has(.option-radio:checked) {
  border-color: var(--primary);
  background: #eff6ff;
}

.option-item:has(.option-radio:checked) .option-letter {
  background: var(--primary);
  border-color: var(--primary);
  color: #ffffff;
}

.option-content {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.option-text {
  min-width: 0;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--text);
  overflow-wrap: anywhere;
}

.option-image {
  max-width: 140px;
  max-height: 120px;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: #ffffff;
  flex-shrink: 0;
}

/* ESSAY */
.essay-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.essay-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}

.essay-input {
  width: 100%;
  min-height: 180px;
  padding: 16px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-family: inherit;
  font-size: 15px;
  line-height: 1.6;
  color: var(--text);
  background: #ffffff;
  resize: vertical;
  outline: none;
  transition: border-color var(--transition), box-shadow var(--transition);
}

.essay-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.essay-input::placeholder { color: var(--text-muted); }

.autosave-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--success);
  font-size: 13px;
  font-weight: 500;
}

.hint-icon { width: 16px; height: 16px; color: var(--success); }

/* AUDIO */
.audio-area {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.audio-placeholder {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1.5px dashed var(--border);
}

.waveform-icon {
  width: 40px;
  height: 40px;
  color: var(--primary);
  flex-shrink: 0;
}

.recording-status {
  font-size: 15px;
  color: var(--text-secondary);
  font-weight: 500;
}

.audio-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.btn-record,
.btn-stop,
.btn-upload {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.btn-record { background: #fef2f2; color: var(--danger); }
.btn-stop { background: #f1f5f9; color: #334155; }
.btn-upload { background: var(--primary); color: #ffffff; }

.btn-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* EMPTY */
.empty-state {
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 60px 24px;
  text-align: center;
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #eff6ff;
  color: var(--primary);
  font-size: 22px;
  font-weight: 700;
}

.empty-state h3 {
  font-size: 18px;
  margin-bottom: 8px;
}

.empty-state p {
  color: var(--text-secondary);
  font-size: 14px;
}

/* SUBMISSION BAR */
.submission-bar {
  position: sticky;
  bottom: 0;
  width: 100%;
  min-width: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 16px 24px;
  margin-top: 32px;
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: 0 -2px 10px rgba(15, 23, 42, 0.06);
}

.question-dots {
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.dot {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.dot:hover {
  background: var(--primary);
  color: #ffffff;
  border-color: var(--primary);
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 22px;
  height: 48px;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--primary);
  color: #ffffff;
  font-family: inherit;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

.submit-btn:hover:not(:disabled) {
  background: var(--primary-hover);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-spinner {
  width: 20px;
  height: 20px;
  animation: test-session-spin 0.8s linear infinite;
}

.spinner-track { opacity: 0.3; }
.spinner-head { stroke-linecap: round; }

@keyframes test-session-spin {
  to { transform: rotate(360deg); }
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .test-session { padding: 28px 20px 140px; }
  .session-content { max-width: 760px; }
}

@media (max-width: 768px) {
  .test-session {
    min-height: 100vh;
    padding: 24px 16px 160px;
  }
  .session-header { padding: 20px; }
  .test-title { font-size: 22px; }
  .header-meta { gap: 16px; }
  .question-card { padding: 20px; }
  .question-text { font-size: 16px; }
  .submission-bar { padding: 14px 16px; }
}

@media (max-width: 640px) {
  .test-session { padding: 16px 12px 180px; }
  .session-header { padding: 16px 18px; margin-bottom: 20px; }
  .header-top { flex-direction: column; gap: 12px; }
  .status-badge { align-self: flex-start; }
  .question-card { padding: 16px 18px; }
  .option-item { padding: 14px 16px; }
  .option-letter {
    width: 28px;
    height: 28px;
    font-size: 13px;
    border-radius: 6px;
  }
  .option-text { font-size: 14px; }
  .option-image { max-width: 100px; max-height: 90px; }
  .submission-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  .question-dots { justify-content: center; }
  .submit-btn { width: 100%; height: 46px; }
  .lock-card { padding: 24px 20px 22px; }
  .lock-title { font-size: 16px; }
  .lock-desc { font-size: 12.5px; }
}

@media (max-width: 480px) {
  .question-card { padding: 14px 16px; }
  .question-text { font-size: 15px; }
  .option-content {
    flex-direction: column;
    align-items: flex-start;
  }
  .option-image { max-width: 100%; max-height: 160px; }
}

@media (prefers-reduced-motion: reduce) {
  .loading-spinner,
  .btn-spinner,
  .lock-enter-active,
  .lock-leave-active {
    transition: none;
    animation: none;
  }
}
</style>