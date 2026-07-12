<template>
  <div class="dashboard-page">
    <!-- Header -->
    <div class="dashboard-header">
      <div>
        <h1>Dashboard Pelamar</h1>
        <p>Ringkasan aktivitas lamaran pekerjaan Anda</p>
      </div>
      <router-link to="/user/lowongan" class="btn-primary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        Cari Lowongan
      </router-link>
    </div>

    <!-- Stat Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-info">
          <span class="stat-label">Total Lamaran</span>
          <h2 class="stat-value">{{ stats.total }}</h2>
        </div>
        <div class="stat-icon blue"><i class="fas fa-file-alt"></i></div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <span class="stat-label">Diproses</span>
          <h2 class="stat-value">{{ stats.screening }}</h2>
        </div>
        <div class="stat-icon orange"><i class="fas fa-clock"></i></div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <span class="stat-label">Interview</span>
          <h2 class="stat-value">{{ stats.interview }}</h2>
        </div>
        <div class="stat-icon purple"><i class="fas fa-comments"></i></div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <span class="stat-label">Diterima</span>
          <h2 class="stat-value">{{ stats.hiring }}</h2>
        </div>
        <div class="stat-icon green"><i class="fas fa-check-circle"></i></div>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="dashboard-grid">
      <!-- Status Lamaran (Progress Bars) -->
      <div class="panel">
        <div class="panel-header">
          <h3>Status Lamaran</h3>
        </div>
        <div v-for="item in statusBars" :key="item.label" class="progress-item">
          <div class="progress-label">
            <span>{{ item.label }}</span>
            <span>{{ item.value }}%</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-fill" :style="{ width: item.value + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- Lowongan Terbaru -->
      <div class="panel">
        <div class="panel-header">
          <h3>Lowongan Terbaru</h3>
          <router-link to="/user/lowongan" class="link-view">Lihat Semua</router-link>
        </div>
        <div v-for="job in recentLowongan" :key="job.id" class="job-item">
          <div class="job-info">
            <strong>{{ job.title }}</strong>
            <p><i class="fas fa-map-marker-alt"></i> {{ job.lokasi }} • {{ job.perusahaan }}</p>
          </div>
          <button class="btn-apply" @click="applyJob(job)">Lamar</button>
        </div>
        <div v-if="recentLowongan.length === 0" class="empty-state">
          Belum ada lowongan tersedia
        </div>
      </div>
    </div>

    <!-- Riwayat Lamaran -->
    <div class="panel full-width">
      <div class="panel-header">
        <h3>Riwayat Lamaran</h3>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Posisi</th>
              <th>Status</th>
              <th>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(lam, idx) in lamaranList" :key="lam.id">
              <td>{{ idx + 1 }}</td>
              <td>{{ lam.posisi }}</td>
              <td>
                <span :class="['status-badge', lam.stage.toLowerCase()]">
                  {{ lam.stage }}
                </span>
              </td>
              <td>{{ formatDate(lam.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="lamaranList.length === 0" class="empty-state">
        Belum ada lamaran yang dikirim
      </div>
    </div>

    <!-- Error Toast -->
    <div v-if="error" class="toast-error">
      <i class="fas fa-exclamation-circle"></i> {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useDashboardUserStore } from '../stores/useDashboardUserStore'
import type { Lowongan } from '../types/dashboardUser.types'
// Store
const store = useDashboardUserStore()

// Data from store
const stats = computed(() => store.stats)
const statusBars = computed(() => store.statusBars)
const recentLowongan = computed(() => store.recentLowongan)
const lamaranList = computed(() => store.lamaranList)
const error = computed(() => store.error)
const loading = computed(() => store.loading)

// Methods
const applyJob = (job: Lowongan) => {
  try {
    store.apply(job.id)
    alert(`Berhasil melamar ke "${job.title}"`)
  } catch (err: any) {
    alert(err.message || 'Gagal melamar')
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID')
}

onMounted(() => {
  store.loadData()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&display=swap');

.dashboard-page {
  padding: 0;
  font-family: 'Inter', sans-serif;
  position: relative;
}

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 28px;
}
.dashboard-header h1 {
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px 0;
}
.dashboard-header p {
  color: #5b6e8c;
  font-size: 14px;
  margin: 0;
}
.btn-primary {
  background: #1f6392;
  color: white;
  padding: 10px 18px;
  border-radius: 40px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  font-size: 14px;
  transition: background 0.2s;
}
.btn-primary:hover {
  background: #154e73;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}
@media (max-width: 1024px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .stats-grid { grid-template-columns: 1fr; }
}
.stat-card {
  background: white;
  border-radius: 20px;
  padding: 18px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02), 0 1px 2px rgba(0, 0, 0, 0.03);
  border: 1px solid #edf2f7;
}
.stat-info {
  flex: 1;
}
.stat-label {
  font-size: 13px;
  font-weight: 500;
  color: #5b6e8c;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin: 6px 0 0;
}
.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: white;
}
.stat-icon.blue { background: #1f6392; }
.stat-icon.orange { background: #f59e0b; }
.stat-icon.purple { background: #8b5cf6; }
.stat-icon.green { background: #10b981; }

/* Dashboard Grid 2 kolom */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 28px;
}
@media (max-width: 1024px) {
  .dashboard-grid { grid-template-columns: 1fr; }
}

/* Panel */
.panel {
  background: white;
  border-radius: 24px;
  padding: 20px;
  border: 1px solid #edf2f7;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}
.panel-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #0f172a;
}
.link-view {
  font-size: 13px;
  color: #1f6392;
  text-decoration: none;
  font-weight: 500;
}
.link-view:hover {
  text-decoration: underline;
}

/* Progress Bars */
.progress-item {
  margin-bottom: 18px;
}
.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 6px;
  color: #334155;
}
.progress-bar-bg {
  height: 6px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: #1f6392;
  border-radius: 10px;
}

/* Job Item */
.job-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #edf2f7;
}
.job-item:last-child {
  border-bottom: none;
}
.job-info strong {
  font-size: 15px;
  color: #0f172a;
}
.job-info p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #5b6e8c;
}
.btn-apply {
  background: #eef2ff;
  border: none;
  border-radius: 30px;
  padding: 6px 16px;
  color: #1f6392;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: 0.2s;
}
.btn-apply:hover {
  background: #e0e7ff;
}

/* Table */
.full-width {
  width: 100%;
  overflow-x: auto;
}
.table-responsive {
  overflow-x: auto;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.data-table th {
  text-align: left;
  padding: 12px 8px;
  background: #f8fafc;
  color: #334155;
  font-weight: 600;
  border-bottom: 1px solid #e2e8f0;
}
.data-table td {
  padding: 12px 8px;
  border-bottom: 1px solid #f0f2f5;
  color: #1e293b;
}
.status-badge {
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 500;
}
.status-badge.apply { background: #dbeafe; color: #1e40af; }
.status-badge.screening { background: #fef3c7; color: #92400e; }
.status-badge.interview { background: #e0f2fe; color: #0369a1; }
.status-badge.hiring { background: #dcfce7; color: #166534; }

.empty-state {
  text-align: center;
  padding: 32px;
  color: #94a3b8;
  font-size: 14px;
}

/* Toast Error */
.toast-error {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #ef4444;
  color: white;
  padding: 12px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>