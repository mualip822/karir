<template>
  <div class="jobs">

    <!-- ==========================================================
         PAGE HEADER
    =========================================================== -->
    <header class="jobs-header">
      <div class="jobs-header-main">
        <span class="jobs-eyebrow">Karier</span>
        <h1 class="jobs-title">Daftar Lowongan</h1>
        <p class="jobs-subtitle">
          Temukan peluang karir yang sesuai dengan minat dan keahlianmu.
        </p>
      </div>

      <div class="jobs-header-meta">
        <span class="jobs-count">
          <strong>{{ jobs.length }}</strong>
          <span>lowongan tersedia</span>
        </span>
      </div>
    </header>

    <!-- ==========================================================
         CONTENT
    =========================================================== -->
    <div class="jobs-content">
      <VacancyGrid
        :jobs="jobs"
        @view-detail="openDetail"
      />
    </div>

    <!-- ==========================================================
         MODALS
    =========================================================== -->
    <VacancyDetailModal
      v-if="selectedJob && showDetail"
      :job="selectedJob"
      @close="showDetail = false"
      @apply="openApply"
    />

    <ApplyModal
      v-if="selectedJob && showApply"
      :job-id="selectedJob.id"
      @close="showApply = false"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import VacancyGrid from '../../website/components/VacancyGrid.vue';
import VacancyDetailModal from '../../website/components/VacancyDetailModal.vue';
import ApplyModal from '../../website/components/ApplyModal.vue';

import { useJobs } from '../../website/composables/useJobs';

import type { Job } from '../../website/types/jobs.types';

const { jobs, fetchJobs } = useJobs();

const selectedJob = ref<Job | null>(null);

const showDetail = ref(false);
const showApply = ref(false);

onMounted(async () => {
  await fetchJobs();
});

function openDetail(job: Job) {
  selectedJob.value = job;
  showDetail.value = true;
}

function openApply(job: Job) {
  selectedJob.value = job;
  showDetail.value = false;
  showApply.value = true;
}
</script>

<style scoped>
/* ============================================================
   DESIGN TOKENS
============================================================ */
.jobs {
  --primary: #2f6bff;
  --primary-hover: #2457d6;
  --primary-soft: #eef2ff;
  --primary-border: #dbe3ff;

  --text: #0d1b2a;
  --text-secondary: #4a5568;
  --text-muted: #8b95a5;

  --bg: #f6f8fb;
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
}

/* ============================================================
   HEADER
============================================================ */
.jobs-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 4px 0;
}

.jobs-header-main { min-width: 0; }

.jobs-eyebrow {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.jobs-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--text);
}

.jobs-subtitle {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.jobs-header-meta {
  flex-shrink: 0;
}

.jobs-count {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  padding: 6px 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 999px;
  font-size: 12px;
  color: var(--text-muted);
}

.jobs-count strong {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}

/* ============================================================
   CONTENT WRAPPER
============================================================ */
.jobs-content {
  width: 100%;
}

/* ============================================================
   OVERRIDE: VacancyGrid (dari website) — bikin lebih premium
============================================================ */
:deep(.vacancy-grid) {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px !important;
}

@media (max-width: 1024px) {
  :deep(.vacancy-grid) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  :deep(.vacancy-grid) {
    grid-template-columns: 1fr;
  }
}

/* Card */
:deep(.vacancy-card) {
  padding: 20px !important;
  border-radius: var(--r-lg) !important;
  border: 1px solid var(--border) !important;
  background: var(--surface) !important;
  box-shadow: none !important;
  transition:
    border-color 0.15s ease,
    background 0.15s ease !important;
}

:deep(.vacancy-card:hover) {
  border-color: #d5dae2 !important;
  background: var(--surface) !important;
  transform: none !important;
  box-shadow: none !important;
}

/* Title */
:deep(.job-title) {
  font-size: 15px !important;
  font-weight: 600 !important;
  color: var(--text) !important;
  letter-spacing: -0.01em !important;
  line-height: 1.35 !important;
}

/* Company */
:deep(.job-company) {
  font-size: 12.5px !important;
  color: var(--text-muted) !important;
}

/* Meta text */
:deep(.job-meta),
:deep(.job-location),
:deep(.job-type) {
  font-size: 12px !important;
  color: var(--text-secondary) !important;
}

/* Button lihat detail */
:deep(.btn-view),
:deep(.btn-detail) {
  height: 32px !important;
  padding: 0 12px !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  border-radius: var(--r-md) !important;
  background: var(--surface) !important;
  color: var(--primary) !important;
  border: 1px solid var(--primary-border) !important;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease !important;
}

:deep(.btn-view:hover),
:deep(.btn-detail:hover) {
  background: var(--primary) !important;
  color: #ffffff !important;
  border-color: var(--primary) !important;
}

/* Tag / chip */
:deep(.job-tag),
:deep(.badge) {
  font-size: 10.5px !important;
  font-weight: 600 !important;
  padding: 3px 8px !important;
  border-radius: 999px !important;
  background: var(--surface-muted) !important;
  color: var(--text-secondary) !important;
  border: 1px solid var(--border-soft) !important;
}

/* ============================================================
   RESPONSIVE
============================================================ */
@media (max-width: 720px) {
  .jobs { gap: 16px; }
  .jobs-title { font-size: 20px; }
  .jobs-subtitle { font-size: 12.5px; }
  .jobs-count { padding: 5px 10px; font-size: 11.5px; }
  .jobs-count strong { font-size: 13px; }
}
</style>