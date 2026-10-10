<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="job"
        class="modal-overlay"
        @click.self="close"
      >
        <div class="modal-container">

          <!-- ==========================================================
               HEADER (sticky top)
          =========================================================== -->
          <header class="modal-header">
            <div class="header-brand">
              <img
                :src="logoImg"
                alt="Logo perusahaan"
                class="modal-logo"
              />
              <div class="header-text">
                <h2 class="modal-title">{{ job.title }}</h2>
                <p class="modal-sub">
                  {{ job.company }}
                  <span class="dot-sep">·</span>
                  {{ job.location }}
                </p>
              </div>
            </div>

            <button
              type="button"
              class="close-btn"
              aria-label="Tutup detail lowongan"
              @click="close"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </header>

          <!-- ==========================================================
               BODY (scrollable)
          =========================================================== -->
          <div class="modal-body">

            <!-- MAIN CONTENT (scrollable area) -->
            <div class="main-content">
              <section v-if="job.aboutPosition" class="block">
                <h3 class="block-title">Tentang Posisi</h3>
                <p class="block-text">{{ job.aboutPosition }}</p>
              </section>

              <section v-if="job.responsibilities.length" class="block">
                <h3 class="block-title">Tanggung Jawab</h3>
                <ul class="list">
                  <li v-for="item in job.responsibilities" :key="item">
                    <span class="list-dot"></span>
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </section>

              <section v-if="job.requirements.length" class="block">
                <h3 class="block-title">Persyaratan</h3>
                <ul class="list">
                  <li v-for="item in job.requirements" :key="item">
                    <span class="list-dot"></span>
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </section>

              <section v-if="job.benefits.length" class="block">
                <h3 class="block-title">Benefit</h3>
                <ul class="list">
                  <li v-for="item in job.benefits" :key="item">
                    <span class="list-dot list-dot-success"></span>
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </section>

              <section v-if="job.skills.length" class="block">
                <h3 class="block-title">Skill yang Dibutuhkan</h3>
                <div class="skills">
                  <span
                    v-for="skill in job.skills"
                    :key="skill"
                    class="skill-pill"
                  >
                    {{ skill }}
                  </span>
                </div>
              </section>
            </div>

            <!-- SIDE PANEL (sticky — tetap terlihat saat scroll) -->
            <aside class="side-panel">
              <div class="info-card">
                <div class="info-row">
                  <span class="info-label">Gaji</span>
                  <strong class="info-value">{{ job.salary }}</strong>
                </div>
                <div class="info-row">
                  <span class="info-label">Pengalaman</span>
                  <span class="info-value">{{ job.experience }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Pendidikan</span>
                  <span class="info-value">{{ job.education }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Tipe Pekerjaan</span>
                  <span class="info-value">{{ job.type }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Deadline</span>
                  <span class="info-value is-deadline">
                    {{ formatDeadline(job.deadline) }}
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">Diposting</span>
                  <span class="info-value">
                    {{ formatRelative(job.postedAt) }}
                  </span>
                </div>
              </div>
            </aside>

          </div>

          <!-- ==========================================================
               FOOTER (sticky bottom)
          =========================================================== -->
          <footer class="modal-footer">
            <div class="footer-info">
              <span class="footer-label">Gaji</span>
              <strong class="footer-value">{{ job.salary }}</strong>
            </div>

            <div class="footer-actions">
              <button
                type="button"
                class="btn btn-secondary"
                @click="close"
              >
                Tutup
              </button>

              <button
                type="button"
                class="btn btn-primary"
                @click="handleApply"
              >
                <span>Lamar Sekarang</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </footer>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { Job } from '../types/jobs.types';
import { JobsService } from '../services/jobs.service';
import logoImg from '../../assets/images/logo.jpg';

const props = defineProps<{ job: Job | null }>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'apply', job: Job): void;
}>();

const router = useRouter();

function close() {
  document.body.style.overflow = 'auto';
  emit('close');
}

function formatRelative(d: string) {
  return JobsService.formatRelativeDate(d);
}

function formatDeadline(d: string | null) {
  return JobsService.formatDeadline(d);
}

function handleApply() {
  const token =
    localStorage.getItem('candidate_token') ||
    localStorage.getItem('token') ||
    localStorage.getItem('auth_token') ||
    localStorage.getItem('access_token');

  if (!token) {
    router.push('/login');
    return;
  }

  if (props.job) {
    emit('apply', props.job);
    close();
  }
}
</script>

<style scoped>
/* ============================================================
   DESIGN TOKENS
============================================================ */
.modal-overlay {
  --primary: #2f6bff;
  --primary-hover: #2457d6;
  --primary-soft: #eef2ff;

  --success: #16a34a;
  --success-soft: #ecfdf5;

  --danger: #dc2626;

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
}

/* ============================================================
   OVERLAY
============================================================ */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(13, 27, 42, 0.55);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

/* ============================================================
   CONTAINER
============================================================ */
.modal-container {
  width: 100%;
  max-width: 1080px;
  max-height: min(90vh, 780px);

  display: flex;
  flex-direction: column;

  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow:
    0 24px 48px -12px rgba(13, 27, 42, 0.18),
    0 12px 24px -12px rgba(13, 27, 42, 0.10);

  overflow: hidden;

  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, sans-serif;
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11', 'ss01';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text);
}

/* ============================================================
   HEADER
============================================================ */
.modal-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px 18px;
  background: var(--surface);
  border-bottom: 1px solid var(--border-soft);
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  flex: 1;
}

.modal-logo {
  width: 44px;
  height: 44px;
  border-radius: var(--r-md);
  object-fit: cover;
  border: 1px solid var(--border);
  flex-shrink: 0;
}

.header-text {
  min-width: 0;
  flex: 1;
}

.modal-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.25;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.modal-sub {
  margin: 4px 0 0;
  font-size: 12.5px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  line-height: 1.5;
}

.dot-sep {
  margin: 0 3px;
  color: var(--text-faint);
}

.close-btn {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  background: var(--surface);
  color: var(--text-secondary);
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.close-btn:hover {
  background: var(--surface-muted);
  border-color: #d5dae2;
  color: var(--text);
}

.close-btn:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* ============================================================
   BODY (scroll container)
============================================================ */
.modal-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;

  display: flex;
  align-items: flex-start;    /* 🔑 supaya child tidak stretch */
  gap: 28px;
  padding: 24px;
  background: var(--surface);
}

.modal-body::-webkit-scrollbar {
  width: 6px;
}
.modal-body::-webkit-scrollbar-track {
  background: transparent;
}
.modal-body::-webkit-scrollbar-thumb {
  background: #d5dae2;
  border-radius: 999px;
}
.modal-body::-webkit-scrollbar-thumb:hover {
  background: #c1c8d1;
}

/* ============================================================
   MAIN CONTENT
============================================================ */
.main-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.block-title {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-soft);
}

.block-text {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--text-secondary);
  white-space: pre-line;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-secondary);
}

.list-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--primary);
  flex-shrink: 0;
  margin-top: 8px;
}

.list-dot-success {
  background: var(--success);
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-pill {
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 12px;
  background: var(--surface-muted);
  border: 1px solid var(--border-soft);
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  letter-spacing: -0.005em;
}

/* ============================================================
   SIDE PANEL — STICKY
   Tetap menempel di atas saat konten utama di-scroll
============================================================ */
.side-panel {
  width: 280px;
  flex-shrink: 0;

  position: sticky;
  top: 0;                    /* 🔑 menempel di atas scroll container */
  align-self: flex-start;    /* 🔑 tanpa ini sticky tidak akan bekerja */
}

.info-card {
  display: flex;
  flex-direction: column;
  padding: 4px 16px;
  background: var(--surface-muted);
  border: 1px solid var(--border-soft);
  border-radius: var(--r-lg);
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-soft);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  flex-shrink: 0;
}

.info-value {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text);
  text-align: right;
  letter-spacing: -0.005em;
  word-break: break-word;
  line-height: 1.45;
}

.info-value.is-deadline {
  color: var(--danger);
}

/* ============================================================
   FOOTER (sticky bottom)
============================================================ */
.modal-footer {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 24px;
  background: var(--surface);
  border-top: 1px solid var(--border-soft);
}

.footer-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.footer-label {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.footer-value {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
  line-height: 1.2;
  white-space: nowrap;
}

.footer-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* ============================================================
   BUTTONS
============================================================ */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 38px;
  padding: 0 16px;
  border-radius: var(--r-md);
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.005em;
  cursor: pointer;
  border: 1px solid transparent;
  white-space: nowrap;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
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
   TRANSITION
============================================================ */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition:
    transform 0.22s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.2s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: translateY(8px) scale(0.98);
  opacity: 0;
}

/* ============================================================
   RESPONSIVE
============================================================ */
@media (max-width: 1024px) {
  .modal-container {
    max-width: 95vw;
  }

  .modal-body {
    flex-direction: column;
    gap: 20px;
  }

  .side-panel {
    width: 100%;
    position: static;     /* 🔑 matikan sticky di tablet & mobile */
    order: -1;            /* info card tampil di atas */
  }
}

@media (max-width: 640px) {
  .modal-overlay {
    padding: 0;
    align-items: flex-end;
  }

  .modal-container {
    max-width: 100%;
    max-height: 92vh;
    border-radius: 16px 16px 0 0;
  }

  .modal-header {
    padding: 16px 18px 14px;
  }

  .modal-logo {
    width: 40px;
    height: 40px;
  }

  .modal-title {
    font-size: 15.5px;
  }

  .modal-sub {
    font-size: 12px;
  }

  .modal-body {
    padding: 18px;
    gap: 18px;
  }

  .modal-footer {
    padding: 12px 16px;
    gap: 10px;
  }

  .footer-value {
    font-size: 13px;
  }

  .footer-actions .btn {
    height: 36px;
    padding: 0 14px;
    font-size: 12.5px;
  }
}

@media (max-width: 480px) {
  .footer-info {
    display: none;
  }

  .footer-actions {
    width: 100%;
  }

  .footer-actions .btn {
    flex: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .modal-enter-active,
  .modal-leave-active,
  .modal-enter-active .modal-container,
  .modal-leave-active .modal-container {
    transition: none;
  }
}
</style>