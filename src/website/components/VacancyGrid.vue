<template>
  <div v-if="jobs.length" class="vacancy-grid">
    <VacancyCard
      v-for="job in jobs"
      :key="job.id"
      :job="job"
      @view-detail="$emit('view-detail', job)"
    />
  </div>

  <div v-else class="empty-state">
    <div class="empty-illustration">
      <svg
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="0.5"
      >
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <line x1="9" y1="9" x2="15" y2="15" />
        <line x1="15" y1="9" x2="9" y2="15" />
      </svg>
    </div>

    <h3>Tidak Ada Lowongan</h3>
    <p>Coba sesuaikan kata kunci atau filter yang digunakan</p>
  </div>
</template>

<script setup lang="ts">
import VacancyCard from './VacancyCard.vue'
import type { Job } from '../types/jobs.types'

defineProps<{
  jobs: Job[]
}>()

defineEmits<{
  (e: 'view-detail', job: Job): void
}>()
</script>

<style scoped>
/* ========================================
   RESPONSIVE AUTO GRID
   ======================================== */

.vacancy-grid {
  display: grid;

  /* otomatis menyesuaikan lebar container */
  grid-template-columns:
    repeat(auto-fit, minmax(340px, 1fr));

  gap: 24px;

  width: 100%;
  align-items: stretch;
}

/* ========================================
   EMPTY STATE
   ======================================== */

.empty-state {
  text-align: center;
  padding: 80px 24px;

  background: white;

  border-radius: 24px;
  border: 2px dashed #e2e8f0;
}

.empty-illustration {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 100px;
  height: 100px;

  background: #f8fafc;

  border-radius: 50%;
  margin-bottom: 24px;

  color: #94a3b8;
}

h3 {
  font-size: 1.25rem;
  color: #0f172a;
  margin-bottom: 8px;
}

p {
  color: #64748b;
  font-size: 0.95rem;
}

/* ========================================
   MOBILE OPTIMIZATION
   ======================================== */

@media (max-width: 640px) {
  .vacancy-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .empty-state {
    padding: 60px 20px;
    border-radius: 20px;
  }

  .empty-illustration {
    width: 80px;
    height: 80px;
  }
}
</style>