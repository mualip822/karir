<template>
  <section class="career" id="career">
    <div class="container">

      <!-- HEADER SECTION -->
      <div class="section-header">
        <div class="header-left">
          <div class="badge">
            <span class="badge-dot"></span>
            Career Opportunities
          </div>
          <h2>
            Bergabung Bersama
            <span class="gradient-text">Tim Profesional</span>
          </h2>
          <p>
            Temukan peluang karier terbaik bersama
            Yayasan Dakwah Imam Nawawi dalam bidang
            pendidikan, dakwah, teknologi, dan administrasi.
          </p>
        </div>

        <div class="header-right">
          
          <!-- SEARCH BAR -->
          <div class="search-wrapper">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="10.5" cy="10.5" r="7.5"/>
              <line x1="21" y1="21" x2="15.8" y2="15.8"/>
            </svg>
            <input
              type="text"
              placeholder="Cari posisi, perusahaan, atau keahlian..."
              :value="searchQuery"
              @input="handleSearchInput"
            />
            <button v-if="searchQuery" class="clear-search" @click="resetSearch">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- FILTERS - LOKASI, KATEGORI, TIPE PEKERJAAN -->
          <div class="filters-grid">
            <!-- Location Filter -->
            <select v-model="filters.location" class="filter-select">
              <option value="">Semua Lokasi</option>
              <option v-for="loc in uniqueLocations" :key="loc" :value="loc">
                {{ loc }}
              </option>
            </select>

            <!-- Category Filter -->
            <select v-model="filters.category" class="filter-select">
              <option value="">Semua Kategori</option>
              <option v-for="cat in uniqueCategories" :key="cat" :value="cat.toLowerCase()">
                {{ cat }}
              </option>
            </select>

            <!-- Job Type Filter - dari master backend -->
            <select v-model="filters.type" class="filter-select">
              <option value="">Semua Tipe</option>
              <option v-for="type in uniqueJobTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>

          <!-- ACTIVE FILTERS TAGS -->
          <transition name="slide-down">
            <div v-if="hasActiveFilters" class="active-filters">
              <span class="filter-label">Filter aktif:</span>
              <div class="filter-tags">
                <span v-if="searchQuery" class="filter-tag">
                  Pencarian: {{ searchQuery }}
                  <button @click="resetSearch" class="remove-tag">×</button>
                </span>
                <span v-if="filters.location" class="filter-tag">
                  Lokasi: {{ filters.location }}
                  <button @click="filters.location = ''" class="remove-tag">×</button>
                </span>
                <span v-if="filters.category" class="filter-tag">
                  Kategori: {{ filters.category }}
                  <button @click="filters.category = ''" class="remove-tag">×</button>
                </span>
                <span v-if="filters.type" class="filter-tag">
                  Tipe: {{ filters.type }}
                  <button @click="filters.type = ''" class="remove-tag">×</button>
                </span>
              </div>
              <button @click="resetFilters" class="reset-all">
                Reset Semua
              </button>
            </div>
          </transition>
        </div>
      </div>

      <!-- RESULTS COUNT -->
      <div v-if="!loading && jobs.length > 0" class="results-count">
        Menampilkan <strong>{{ filteredJobs.length }}</strong> lowongan
        <span v-if="hasActiveFilters">dari <strong>{{ jobs.length }}</strong> total</span>
      </div>

      <!-- LOADING SKELETON -->
      <div v-if="loading" class="loading-skeleton">
        <div v-for="i in 6" :key="i" class="skeleton-card">
          <div class="skeleton-header">
            <div class="skeleton-icon"></div>
            <div class="skeleton-title">
              <div class="skeleton-line"></div>
              <div class="skeleton-line short"></div>
            </div>
          </div>
          <div class="skeleton-body">
            <div class="skeleton-line medium"></div>
            <div class="skeleton-grid">
              <div class="skeleton-chip"></div>
              <div class="skeleton-chip"></div>
              <div class="skeleton-chip"></div>
              <div class="skeleton-chip"></div>
            </div>
            <div class="skeleton-skills">
              <div class="skeleton-skill"></div>
              <div class="skeleton-skill"></div>
              <div class="skeleton-skill"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ERROR STATE -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h3>Gagal Memuat Data</h3>
        <p>{{ error }}</p>
        <button @click="retryFetch" class="retry-button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M23 4v6h-6M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          Coba Lagi
        </button>
      </div>

      <!-- VACANCY GRID -->
      <VacancyGrid
        v-else
        :jobs="filteredJobs"
        @view-detail="openDetail"
      />

    </div>

    <!-- DETAIL MODAL -->
    <VacancyDetailModal
      :job="selectedJob"
      @close="closeDetail"
      v-if="selectedJob"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useJobs } from '../composables/useJobs'
import VacancyGrid from './VacancyGrid.vue'
import VacancyDetailModal from './VacancyDetailModal.vue'
import type { Job } from '../types/jobs.types'

const {
  jobs,
  loading,
  error,
  searchQuery,
  filters,
  uniqueCategories,
  uniqueLocations,
  uniqueJobTypes,
  filteredJobs,
  hasActiveFilters,
  resetFilters,
  updateSearch,
  retryFetch
} = useJobs()

const selectedJob = ref<Job | null>(null)

function handleSearchInput(event: Event) {
  const target = event.target as HTMLInputElement
  updateSearch(target.value)
}

function resetSearch() {
  updateSearch('')
}

function openDetail(job: Job) {
  selectedJob.value = job
  document.body.style.overflow = 'hidden'
}

function closeDetail() {
  selectedJob.value = null
  document.body.style.overflow = 'auto'
}
</script>

<style scoped>
.career {
  padding: 100px 0;
  background: linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 48px;
  margin-bottom: 56px;
}

.header-left {
  flex: 1;
  max-width: 520px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 20px;
  background: linear-gradient(135deg, #0F766E15, #14B8A615);
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  color: #0F766E;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: #0F766E;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.header-left h2 {
  font-size: 52px;
  font-weight: 800;
  line-height: 1.15;
  color: #0F172A;
  margin-bottom: 20px;
  letter-spacing: -0.02em;
}

.gradient-text {
  background: linear-gradient(135deg, #0F766E, #14B8A6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.header-left p {
  font-size: 17px;
  line-height: 1.7;
  color: #475569;
}

.header-right {
  flex: 1;
  max-width: 580px;
}

.search-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #94A3B8;
  pointer-events: none;
}

.search-wrapper input {
  width: 100%;
  height: 56px;
  padding: 0 48px 0 52px;
  border: 2px solid #E2E8F0;
  border-radius: 60px;
  font-size: 15px;
  background: white;
  transition: all 0.3s ease;
}

.search-wrapper input:focus {
  outline: none;
  border-color: #0F766E;
  box-shadow: 0 0 0 4px rgba(15, 118, 110, 0.1);
}

.clear-search {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #94A3B8;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.clear-search:hover {
  color: #EF4444;
  background: #FEF2F2;
}

/* Sekarang 3 kolom karena hanya ada 3 filter */
.filters-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.filter-select {
  height: 48px;
  padding: 0 16px;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  background: white;
  font-size: 14px;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-select:hover {
  border-color: #0F766E;
}

.filter-select:focus {
  outline: none;
  border-color: #0F766E;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1);
}

.active-filters {
  padding: 16px 20px;
  background: white;
  border-radius: 20px;
  border: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
}

.filter-label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex: 1;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #F1F5F9;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  color: #0F172A;
}

.remove-tag {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #94A3B8;
  padding: 0 4px;
}

.remove-tag:hover {
  color: #EF4444;
}

.reset-all {
  padding: 8px 20px;
  background: #EF4444;
  color: white;
  border: none;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-all:hover {
  background: #DC2626;
  transform: translateY(-1px);
}

.results-count {
  margin-bottom: 32px;
  padding: 12px 0;
  font-size: 14px;
  color: #64748B;
  border-bottom: 1px solid #E2E8F0;
}

.results-count strong {
  color: #0F766E;
  font-weight: 700;
}

.loading-skeleton {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.skeleton-card {
  background: white;
  border-radius: 28px;
  padding: 24px;
  border: 1px solid #E2E8F0;
}

.skeleton-header {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.skeleton-icon {
  width: 52px;
  height: 52px;
  background: linear-gradient(90deg, #E2E8F0 25%, #F1F5F9 50%, #E2E8F0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 16px;
}

.skeleton-title {
  flex: 1;
}

.skeleton-line {
  height: 20px;
  background: linear-gradient(90deg, #E2E8F0 25%, #F1F5F9 50%, #E2E8F0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
  margin-bottom: 8px;
}

.skeleton-line.short {
  width: 60%;
}

.skeleton-line.medium {
  width: 80%;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 16px 0;
}

.skeleton-chip {
  height: 32px;
  background: linear-gradient(90deg, #E2E8F0 25%, #F1F5F9 50%, #E2E8F0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 12px;
}

.skeleton-skills {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

.skeleton-skill {
  width: 70px;
  height: 28px;
  background: linear-gradient(90deg, #E2E8F0 25%, #F1F5F9 50%, #E2E8F0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 999px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.error-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 32px;
  border: 1px solid #FEE2E2;
}

.error-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  background: #FEF2F2;
  border-radius: 50%;
  margin-bottom: 24px;
}

.error-icon svg {
  color: #EF4444;
}

.error-state h3 {
  font-size: 24px;
  color: #0F172A;
  margin-bottom: 12px;
}

.error-state p {
  color: #64748B;
  margin-bottom: 28px;
}

.retry-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 32px;
  background: #0F766E;
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: #115E59;
  transform: translateY(-2px);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media (max-width: 1024px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 36px;
  }

  .header-left, .header-right {
    max-width: 100%;
  }

  .filters-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .loading-skeleton {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .career {
    padding: 60px 0;
  }

  .header-left h2 {
    font-size: 36px;
  }

  .filters-grid {
    grid-template-columns: 1fr;
  }

  .loading-skeleton {
    grid-template-columns: 1fr;
  }

  .active-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-tags {
    justify-content: center;
  }

  .reset-all {
    width: 100%;
  }
}
</style>