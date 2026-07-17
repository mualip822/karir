<template>
  <div class="test-session">
    <!-- Loading state -->
    <div v-if="store.loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Memuat soal...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="store.error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h2>Terjadi Kesalahan</h2>
      <p>{{ store.error }}</p>
      <button class="retry-btn" @click="store.fetchAttemptQuestions(attemptId)">Coba Lagi</button>
    </div>

    <!-- Main content -->
    <div v-else class="session-content">
      <!-- Header card -->
      <header class="session-header">
        <div class="header-top">
          <h1 class="test-title">
            {{ store.currentAttempt?.test_title || 'Test Rekrutmen' }}
          </h1>
          <span v-if="store.currentAttempt?.status" class="status-badge">
            {{ store.currentAttempt.status }}
          </span>
        </div>
        <div class="header-meta">
          <div class="meta-item">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="1"/>
            </svg>
            <span>{{ store.questions.length }} Soal</span>
          </div>
          <div v-if="store.currentAttempt?.test_description" class="meta-item">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <span>{{ store.currentAttempt.test_description }}</span>
          </div>
          <div v-if="store.currentAttempt?.duration_minutes" class="meta-item">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>{{ store.currentAttempt.duration_minutes }} Menit</span>
          </div>
        </div>
      </header>

      <!-- Questions list -->
      <div v-if="store.questions.length" class="questions-grid">
        <div v-for="(q, index) in store.questions" :key="q.id" class="question-card">
          <!-- Number badge -->
          <div class="question-number">
            <span>{{ index + 1 }}</span>
          </div>

          <!-- Question text -->
          <!-- Question text -->
<p class="question-text">{{ q.question_text }}</p>

<img
  v-if="q.question_image"
  :src="getImageUrl(q.question_image)"
  class="question-image"
  alt="Question Image"
  @error="console.log('ERROR', getImageUrl(q.question_image))"
  @load="console.log('LOAD', getImageUrl(q.question_image))"
/>

          <!-- Multiple Choice -->
          <div v-if="q.question_type === 'MULTIPLE_CHOICE'" class="options-group">
            <label
  v-for="(opt, optIndex) in q.options"
  :key="opt.id"
  class="option-item"
>
  <input
    type="radio"
    :name="'q_' + q.id"
    :value="opt.id"
    class="option-radio"
    @change="answerQuestion(q, opt.id)"
  />

  <!-- Huruf Pilihan -->
  <div class="option-letter">
    {{ String.fromCharCode(65 + optIndex) }}
  </div>

  <div class="option-content">
    <img
      v-if="opt.option_image"
      :src="getImageUrl(opt.option_image)"
      class="option-image"
      alt="Option Image"
    />

    <span class="option-text">
      {{ opt.option_text }}
    </span>
  </div>
</label>
          </div>

          <!-- Essay -->
          <div v-if="q.question_type === 'ESSAY'" class="essay-area">
            <textarea
              class="essay-input"
              placeholder="Tulis jawaban Anda di sini..."
              @input="
                debouncedSaveEssay(
                  q,
                  ($event.target as HTMLTextAreaElement).value
                )
              "
            ></textarea>
            <div class="autosave-hint">
              <svg class="hint-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              <span>Tersimpan otomatis</span>
            </div>
          </div>

          <!-- Audio -->
          <div v-if="q.question_type === 'AUDIO'" class="audio-area">
            <div class="audio-placeholder">
              <svg class="waveform-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M2 12h2M6 8v8M10 5v14M14 9v6M18 7v10M22 10v4"/>
              </svg>
              <span class="recording-status">Siap merekam</span>
            </div>
            <div class="audio-controls">
              <button class="btn-record" @click="startRecording">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="6"/>
                </svg>
                Rekam
              </button>
              <button class="btn-stop" @click="stopRecording">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="6" width="12" height="12" rx="2"/>
                </svg>
                Stop
              </button>
              <button class="btn-upload" @click="uploadAudio(q)">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sticky bottom bar with submit -->
      <div class="submission-bar">
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
          @click="submitTest"
          :disabled="submitting"
        >
          <svg v-if="submitting" class="btn-spinner" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="spinner-track"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="4" stroke-linecap="round" class="spinner-head"/>
          </svg>
          <svg v-else class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12l2 2 4-4"/>
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/>
          </svg>
          <span>{{ submitting ? 'Mengirim...' : 'Selesaikan Test' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useTestSessionStore } from '../stores/useTestSessionStore';
import type { QuestionWithOptions } from '../types/test.types';

const route = useRoute();
const store = useTestSessionStore();
const attemptId = route.params.attemptId as string;
const submitting = ref(false);
const API_URL = import.meta.env.VITE_API_URL.replace("/api", "");

const getImageUrl = (path?: string | null) => {
  if (!path) return '';

  if (path.startsWith('http')) {
    return path;
  }

  const normalized = path.replace(/\\/g, '/');

  return `${API_URL}/${normalized.replace(/^\/+/, '')}`;
};
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];

onMounted(async () => {
  await store.fetchAttemptQuestions(attemptId);

  console.log(
    'QUESTIONS:',
    JSON.stringify(store.questions, null, 2)
  );
});

const answerQuestion = async (
  question: QuestionWithOptions,
  optionId: string
) => {
  console.log("========== KLIK RADIO ==========");
  console.log("QUESTION :", question.id);
  console.log("OPTION   :", optionId);

  try {
    const payload = {
      attempt_id: attemptId,
      question_id: question.id,
      selected_option_id: optionId,
    };

    console.log("PAYLOAD :", payload);

    await store.saveAnswer(payload);

    console.log("BERHASIL SIMPAN");
  } catch (err) {
    console.error("SAVE ERROR", err);
  }
};

const debouncedSaveEssay = debounce(async (question: QuestionWithOptions, text: string) => {
  await store.saveAnswer({
    attempt_id: attemptId,
    question_id: question.id,
    answer_text: text,
  });
}, 1000);

const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
  mediaRecorder.start();
};

const stopRecording = () => {
  mediaRecorder?.stop();
};

const uploadAudio = async (question: QuestionWithOptions) => {
  const blob = new Blob(audioChunks, { type: 'audio/webm' });
  const formData = new FormData();
  formData.append('attempt_id', attemptId);
  formData.append('question_id', question.id);
  formData.append('audio', blob, 'answer.webm');
  await store.saveAudioAnswer(formData);
  audioChunks = [];
};

const submitTest = async () => {
  if (submitting.value) return;
  submitting.value = true;
  await store.submitTest(attemptId);
};

function debounce(fn: Function, delay: number) {
  let timer: number;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
</script>

<style>
/* Import Inter font globally */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
.test-session {
  --primary: #6366F1;
  --primary-hover: #4F46E5;
  --secondary: #8B5CF6;
  --bg: #F8FAFC;
  --card: #FFFFFF;
  --text: #0F172A;
  --text-secondary: #475569;
  --border: #E2E8F0;
  --success: #22C55E;
  --danger: #EF4444;
  --radius: 16px;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 8px 30px rgba(0, 0, 0, 0.08);
  --transition: 0.2s ease-in-out;

  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  padding: 24px 16px 120px;
}
.option-image {
  width: 90px;
  height: 90px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.option-content {
  display: flex;
  align-items: center;
  gap: 12px;
}
.option-item {
  min-height: 110px;
}


.option-image {
  width: 100%;
  max-width: 100%;
  height: 220px;
  object-fit: contain;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  padding: 6px;
}

/* Loading & Error */
.loading-state,
.error-state {
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
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-state h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.error-state p {
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.retry-btn {
  background: var(--primary);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: var(--radius);
  font-weight: 600;
  cursor: pointer;
  transition: background var(--transition);
}
.retry-btn:hover {
  background: var(--primary-hover);
}

/* Session Layout */
.session-content {
  max-width: 840px;
  margin: 0 auto;
}

/* Header Card */
.session-header {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: var(--radius);
  padding: 28px 32px;
  margin-bottom: 32px;
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 16px;
  z-index: 10;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.test-title {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--text);
}

.status-badge {
  background: var(--primary);
  color: white;
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  text-transform: capitalize;
}

.header-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  color: var(--text-secondary);
  font-size: 15px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: var(--primary);
}

/* Questions Grid */
.questions-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Question Card */
.question-card {
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 6px 20px rgba(0,0,0,.08);
  border: 1px solid #e5e7eb;
}

.question-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.question-number {
  position: absolute;
  top: -12px;
  left: 24px;
  background: var(--primary);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

.question-text {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.5;
  margin-bottom: 24px;
  color: var(--text);
  padding-top: 12px;
}

/* Multiple Choice Options */
.options-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 18px;
  border: 1px solid var(--border);
  border-radius: 16px;
  cursor: pointer;
  transition: .3s;
  background: white;
  position: relative;
}

.option-item:hover {
  border-color: var(--primary);
  background: rgba(99, 102, 241, 0.04);
  transform: translateX(2px);
}

.option-item:has(.option-radio:checked) {
  border-color: var(--primary);
  background: rgba(99, 102, 241, 0.08);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.option-radio {
  appearance: none;
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.option-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--border);
  background: white;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
}

.option-item:has(.option-radio:checked) .option-indicator {
  border-color: var(--primary);
  background: var(--primary);
}

.option-item:has(.option-radio:checked) .option-indicator::after {
  content: "";
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
}

.option-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--text);
  line-height: 1.4;
}

/* Essay Area */
.essay-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.essay-input {
  width: 100%;
  min-height: 160px;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: 14px;
  font-family: inherit;
  font-size: 16px;
  line-height: 1.6;
  color: var(--text);
  background: var(--bg);
  resize: vertical;
  transition: border-color var(--transition), box-shadow var(--transition);
  outline: none;
}

.essay-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  background: white;
}

.essay-input::placeholder {
  color: #94A3B8;
  font-weight: 400;
}

.autosave-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 13px;
}

.hint-icon {
  width: 16px;
  height: 16px;
  color: var(--success);
}

/* Audio Area */
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
  background: var(--bg);
  border-radius: 14px;
  border: 1px dashed var(--border);
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
  gap: 12px;
  flex-wrap: wrap;
}

.btn-record,
.btn-stop,
.btn-upload {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all var(--transition);
  font-family: inherit;
}

.btn-record {
  background: #FEE2E2;
  color: #DC2626;
}
.btn-record:hover {
  background: #FECACA;
}

.btn-stop {
  background: #E2E8F0;
  color: #334155;
}
.btn-stop:hover {
  background: #CBD5E1;
}

.btn-upload {
  background: var(--primary);
  color: white;
}
.btn-upload:hover {
  background: var(--primary-hover);
}

.btn-icon {
  width: 18px;
  height: 18px;
}

/* Sticky Submission Bar */
.submission-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid var(--border);
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  z-index: 20;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.04);
}

.question-dots {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.dot {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: var(--bg);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  transition: all var(--transition);
}

.dot:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
  transform: translateY(-2px);
}

.submit-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all var(--transition);
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
  white-space: nowrap;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-spinner {
  width: 20px;
  height: 20px;
  animation: spin 0.8s linear infinite;
}

.spinner-track {
  opacity: 0.3;
}

.spinner-head {
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes dash {
  0% { stroke-dasharray: 1, 150; }
  50% { stroke-dasharray: 90, 150; }
  100% { stroke-dasharray: 90, 150; }
}

/* Responsive */
@media (max-width: 640px) {
  .test-session {
    padding: 16px 12px 100px;
  }

  .session-header {
    padding: 20px;
    top: 8px;
  }

  .test-title {
    font-size: 22px;
  }

  .question-card {
    padding: 20px;
  }

  .question-text {
    font-size: 16px;
  }

  .submission-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .question-dots {
    justify-content: center;
  }

  .submit-btn {
    justify-content: center;
    width: 100%;
  }
}

@media (min-width: 1024px) {
  .test-session {
    padding: 40px 32px 140px;
  }
}
@media (max-width:1024px){

  .question-image {
    max-width: 280px;
    max-height: 280px;
}

  .option-image{
    height:180px;
  }

}

@media (max-width:768px){

  .question-card{
    padding:20px;
  }

  .question-image{
    max-height:280px;
  }

  .option-image{
    height:140px;
  }

}

@media (max-width:480px){

  .question-image{
    max-height:220px;
  }

  .option-image{
    height:120px;
  }

}
</style>