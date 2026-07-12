<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="job"
        class="modal-overlay"
        @click.self="close"
      >
        <div class="modal-container">
          <!-- HEADER -->
          <div class="modal-header">
            <div class="header-left">
              <img
                :src="logoImg"
                alt="Logo"
                class="modal-logo"
              />
              <div>
                <h2>{{ job.title }}</h2>
                <div class="company-location">
                  {{ job.company }} &bull; {{ job.location }}
                </div>
              </div>
            </div>
            <button class="close-btn" @click="close">&times;</button>
          </div>

          <!-- BODY -->
          <div class="modal-body">
            <!-- MAIN CONTENT -->
            <div class="main-content">
              <section v-if="job.aboutPosition">
                <h3>Tentang Posisi</h3>
                <p>{{ job.aboutPosition }}</p>
              </section>

              <section v-if="job.responsibilities.length">
                <h3>Tanggung Jawab</h3>
                <ul>
                  <li v-for="item in job.responsibilities" :key="item">{{ item }}</li>
                </ul>
              </section>

              <section v-if="job.requirements.length">
                <h3>Persyaratan</h3>
                <ul>
                  <li v-for="item in job.requirements" :key="item">{{ item }}</li>
                </ul>
              </section>

              <section v-if="job.benefits.length">
                <h3>Benefit</h3>
                <ul>
                  <li v-for="item in job.benefits" :key="item">{{ item }}</li>
                </ul>
              </section>

              <section v-if="job.skills.length">
                <h3>Skill yang Dibutuhkan</h3>
                <div class="skills-list">
                  <span v-for="skill in job.skills" :key="skill" class="skill-pill">{{ skill }}</span>
                </div>
              </section>
            </div>

            <!-- SIDE PANEL -->
            <aside class="side-panel">
              <div class="info-card">
                <div class="info-row">
                  <span class="label">Gaji</span>
                  <strong class="value">{{ job.salary }}</strong>
                </div>
                <div class="info-row">
                  <span class="label">Pengalaman</span>
                  <span class="value">{{ job.experience }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Pendidikan</span>
                  <span class="value">{{ job.education }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Tipe Pekerjaan</span>
                  <span class="value">{{ job.type }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Deadline</span>
                  <span class="value deadline">{{ formatDeadline(job.deadline) }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Diposting</span>
                  <span class="value">{{ formatRelative(job.postedAt) }}</span>
                </div>

                <button class="apply-btn" @click="handleApply">
                  Lamar Sekarang
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Job } from '../types/jobs.types'
import { JobsService } from '../services/jobs.service'
import logoImg from '../../assets/images/logo.jpg'

const props = defineProps<{ job: Job | null }>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'apply', job: Job): void
}>()

const router = useRouter()

function close() {
  document.body.style.overflow = 'auto'
  emit('close')
}

function formatRelative(d: string) {
  return JobsService.formatRelativeDate(d)
}

function formatDeadline(d: string | null) {
  return JobsService.formatDeadline(d)
}

function handleApply() {
  const token =
    localStorage.getItem('candidate_token') ||
    localStorage.getItem('token') ||
    localStorage.getItem('auth_token') ||
    localStorage.getItem('access_token')

  if (!token) {
    router.push('/login')
    return
  }

  if (props.job) {
    emit('apply', props.job)
    close() // opsional: tutup detail modal agar form muncul di atas
  }
}
</script>

<style scoped>
/* ========================================
   MODAL OVERLAY & CONTAINER
   ======================================== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-container {
  background: white;
  width: 100%;
  max-width: 1100px;
  max-height: calc(100vh - 40px);
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.12);
}

/* HEADER */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 28px;
  border-bottom: 1px solid #e2e8f0;
  background: white;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.modal-logo {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  object-fit: cover;
}

h2 {
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px;
}

.company-location {
  font-size: 0.9rem;
  color: #64748b;
}

.close-btn {
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  background: #f1f5f9;
  color: #64748b;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.close-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

/* BODY */
.modal-body {
  display: flex;
  gap: 28px;
  padding: 28px;
  overflow-y: auto;
}

.main-content {
  flex: 1;
}

.main-content section {
  margin-bottom: 28px;
}

.main-content h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
}

.main-content p,
li {
  font-size: 0.95rem;
  line-height: 1.7;
  color: #334155;
}

ul {
  padding-left: 18px;
}

li {
  margin-bottom: 6px;
}

/* SKILLS */
.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-pill {
  background: #f1f5f9;
  color: #334155;
  font-size: 0.85rem;
  padding: 6px 14px;
  border-radius: 999px;
}

/* SIDE PANEL */
.side-panel {
  width: 300px;
  flex-shrink: 0;
}

.info-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;
}
.info-row:last-of-type {
  border-bottom: none;
}

.label {
  color: #64748b;
  font-size: 0.9rem;
}

.value {
  color: #0f172a;
  font-size: 0.92rem;
  font-weight: 600;
  text-align: right;
}

.deadline {
  color: #ef4444;
}

/* APPLY BUTTON */
.apply-btn {
  width: 100%;
  margin-top: 20px;
  padding: 14px;
  border: none;
  border-radius: 14px;
  background: #2563eb;
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}
.apply-btn:hover {
  background: #1d4ed8;
}

/* TRANSITION */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .modal-container {
    max-width: 95vw;
  }
  .modal-body {
    flex-direction: column;
  }
  .side-panel {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .modal-overlay {
    padding: 0;
    align-items: flex-end;
  }
  .modal-container {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 24px 24px 0 0;
  }
  .modal-header,
  .modal-body {
    padding: 18px;
  }
  h2 {
    font-size: 1.1rem;
  }
  .company-location {
    font-size: 0.82rem;
  }
}
</style>