<template>
  <div class="user-lowongan-page">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h1>Daftar Lowongan</h1>
        <p>
          Temukan peluang karir terbaik sesuai minat dan keahlian Anda
        </p>
      </div>
    </div>

    <!-- Content Wrapper -->
    <div class="content-wrapper">

      <VacancyGrid
        :jobs="jobs"
        @view-detail="openDetail"
      />

    </div>

    <!-- DETAIL MODAL -->
    <VacancyDetailModal
      v-if="selectedJob && showDetail"
      :job="selectedJob"
      @close="showDetail = false"
      @apply="openApply"
    />

    <!-- APPLY MODAL -->
    <ApplyModal
      v-if="selectedJob && showApply"
      :job-id="selectedJob.id"
      @close="showApply = false"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import VacancyGrid from '../../website/components/VacancyGrid.vue'
import VacancyDetailModal from '../../website/components/VacancyDetailModal.vue'
import ApplyModal from '../../website/components/ApplyModal.vue'

import { useJobs } from '../../website/composables/useJobs'

import type { Job } from '../../website/types/jobs.types'

const { jobs, fetchJobs } = useJobs()

const selectedJob = ref<Job | null>(null)

const showDetail = ref(false)
const showApply = ref(false)

onMounted(async () => {
  await fetchJobs()
})

function openDetail(job: Job) {
  selectedJob.value = job
  showDetail.value = true
}

function openApply(job: Job) {
  selectedJob.value = job

  showDetail.value = false
  showApply.value = true
}
</script>

<style scoped>
.user-lowongan-page {
  padding: 20px 28px 40px;
  background: #f8fafc;
  min-height: 100vh;
}

/* HEADER */
.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 8px;
  letter-spacing: -0.5px;
}

.page-header p {
  color: #64748b;
  font-size: 15px;
  margin: 0;
}

/* WRAPPER */
.content-wrapper {
  width: 100%;
}

/* Bikin card lebih kecil khusus portal user */
:deep(.vacancy-grid) {
  gap: 18px !important;
}

/* Card compact */
:deep(.vacancy-card) {
  padding: 20px !important;
  border-radius: 18px !important;
}

/* Title */
:deep(.job-title) {
  font-size: 16px !important;
}

/* Responsive */
@media (max-width: 1200px) {
  .user-lowongan-page {
    padding: 18px;
  }
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 26px;
  }

  :deep(.vacancy-grid) {
    grid-template-columns: 1fr !important;
  }
}
</style>