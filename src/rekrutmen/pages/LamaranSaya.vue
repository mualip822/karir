<template>
  <div class="lamaran-page">
    <div class="container-fluid px-4 py-4">
      <!-- Header -->
      <div class="page-header mb-4">
        <h1 class="page-title">Lamaran Saya</h1>
        <p class="page-subtitle">Pantau seluruh proses lamaran pekerjaan yang telah Anda kirim.</p>
      </div>

      <!-- Toolbar -->
      <div class="toolbar mb-3">
        <div class="toolbar-left">
          <div class="search-box">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari posisi, lembaga, atau lokasi..."
              class="search-input"
            />
          </div>
        </div>
        <div class="toolbar-right">
          <div class="filter-tabs">
            <button
              v-for="status in statusFilters"
              :key="status.value"
              @click="selectedStatus = status.value"
              :class="['filter-pill', { active: selectedStatus === status.value }]"
            >
              {{ status.label }}
            </button>
          </div>
          <button class="btn-icon" @click="store.fetchLamaranSaya()" title="Refresh">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 11-2.64-6.36" />
              <path d="M21 3v6h-6" />
            </svg>
          </button>
          <button class="btn-icon" @click="handleExport" title="Export (dummy)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="store.loading" class="table-container">
        <div class="skeleton-table">
          <div class="skeleton-header">
            <div class="shimmer-cell w-8"></div>
            <div class="shimmer-cell w-20"></div>
            <div class="shimmer-cell w-20"></div>
            <div class="shimmer-cell w-15"></div>
            <div class="shimmer-cell w-15"></div>
            <div class="shimmer-cell w-12"></div>
            <div class="shimmer-cell w-10"></div>
          </div>
          <div v-for="n in 10" :key="n" class="skeleton-row">
            <div class="shimmer-cell w-8"></div>
            <div class="shimmer-cell w-20"></div>
            <div class="shimmer-cell w-20"></div>
            <div class="shimmer-cell w-15"></div>
            <div class="shimmer-cell w-15"></div>
            <div class="shimmer-cell w-12"></div>
            <div class="shimmer-cell w-10"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="store.error" class="error-card">
        <div class="error-icon">⚠️</div>
        <h4>Terjadi Kesalahan</h4>
        <p>{{ store.error }}</p>
        <button @click="store.fetchLamaranSaya()" class="btn-outline">Coba Lagi</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredLamaran.length === 0 && !searchQuery && selectedStatus === 'semua'" class="empty-state">
        <div class="empty-illustration">
          <svg width="160" height="120" viewBox="0 0 160 120" fill="none">
            <rect x="20" y="20" width="120" height="80" rx="12" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="2" />
            <path d="M60 50h40M60 60h30" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round" />
            <circle cx="55" cy="50" r="8" fill="#cbd5e1" />
            <circle cx="55" cy="60" r="8" fill="#cbd5e1" />
          </svg>
        </div>
        <h2>Belum Ada Lamaran</h2>
        <p>Anda belum mengirim lamaran pekerjaan. Cari lowongan yang sesuai dan mulai perjalanan karier Anda.</p>
        <button class="btn-primary" @click="$router.push('/user/lowongan')">Lihat Lowongan</button>
      </div>

      <!-- Table -->
      <div v-else class="table-container">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 60px">No</th>
                <th>Posisi</th>
                <th>Lembaga</th>
                <th>Lokasi</th>
                <th>Tanggal Lamar</th>
                <th>Status</th>
                <th style="width: 100px">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in paginatedLamaran"
                :key="item.id"
                :class="{ 'even-row': index % 2 === 0 }"
                @click="goToDetail(item.id)"
              >
                <td class="text-muted">{{ (currentPage - 1) * perPage + index + 1 }}</td>
                <td class="fw-semibold">{{ item.posisi }}</td>
                <td>{{ item.lembaga }}</td>
                <td>{{ item.lokasi }}</td>
                <td>{{ formatDate(item.created_at) }}</td>
                <td><span :class="['status-badge', item.status]">{{ statusLabel(item.status) }}</span></td>
                <td>
                  <button class="btn-detail" @click.stop="goToDetail(item.id)">
                    <span>Detail</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination" v-if="totalPages > 1">
          <div class="pagination-info">
            Menampilkan {{ startItem }}–{{ endItem }} dari {{ filteredLamaran.length }} lamaran
          </div>
          <div class="pagination-controls">
            <button
              :disabled="currentPage === 1"
              @click="currentPage = 1"
              class="page-btn"
              title="Awal"
            >
              «
            </button>
            <button
              :disabled="currentPage === 1"
              @click="currentPage--"
              class="page-btn"
            >
              ‹
            </button>
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              :class="['page-btn', { active: currentPage === page }]"
            >
              {{ page }}
            </button>
            <button
              :disabled="currentPage === totalPages"
              @click="currentPage++"
              class="page-btn"
            >
              ›
            </button>
            <button
              :disabled="currentPage === totalPages"
              @click="currentPage = totalPages"
              class="page-btn"
              title="Akhir"
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useLamaranStore } from '../stores/useLamaranStore';
import type { Lamaran } from '../types/lamaran.types';

const router = useRouter();
const store = useLamaranStore();

const searchQuery = ref('');
const selectedStatus = ref('semua');
const currentPage = ref(1);
const perPage = 10;

const statusFilters = [
  { label: 'Semua', value: 'semua' },
  { label: 'Pending', value: 'pending' },
  { label: 'Review', value: 'review' },
  { label: 'Interview', value: 'interview' },
  { label: 'Diterima', value: 'accepted' },
  { label: 'Ditolak', value: 'rejected' },
];

const statusLabel = (status: string) => {
  const map: Record<string, string> = {
    pending: 'Pending',
    review: 'Review',
    interview: 'Interview',
    accepted: 'Diterima',
    rejected: 'Ditolak',
  };
  return map[status] || status;
};

const filteredLamaran = computed(() => {
  let result = store.lamaran;
  if (selectedStatus.value !== 'semua') {
    result = result.filter(item => item.status === selectedStatus.value);
  }
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      item =>
        item.posisi.toLowerCase().includes(query) ||
        item.lembaga?.toLowerCase().includes(query) ||
        item.lokasi?.toLowerCase().includes(query)
    );
  }
  return result;
});

const totalPages = computed(() => Math.ceil(filteredLamaran.value.length / perPage) || 1);

const paginatedLamaran = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredLamaran.value.slice(start, start + perPage);
});

const startItem = computed(() => (currentPage.value - 1) * perPage + 1);
const endItem = computed(() => Math.min(currentPage.value * perPage, filteredLamaran.value.length));

const visiblePages = computed(() => {
  const pages: number[] = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = start + maxVisible - 1;
  if (end > totalPages.value) {
    end = totalPages.value;
    start = Math.max(1, end - maxVisible + 1);
  }
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

watch([searchQuery, selectedStatus], () => {
  currentPage.value = 1;
});

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
};

const goToDetail = (id: number) => {
  router.push({ name: 'detail-lamaran', params: { id } });
};

const handleExport = () => {
  // Dummy export
  alert('Fitur export belum tersedia.');
};

onMounted(() => {
  store.fetchLamaranSaya();
});
</script>

<style scoped>
/* ==================== GLOBAL ==================== */
.lamaran-page {
  background: #f8fafc;
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #0f172a;
}

/* ==================== HEADER ==================== */
.page-header {
  margin-bottom: 1.5rem;
}
.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}
.page-subtitle {
  font-size: 0.95rem;
  color: #64748b;
  margin-top: 0.25rem;
}

/* ==================== TOOLBAR ==================== */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}
.toolbar-left {
  flex: 1;
  min-width: 280px;
}
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  max-width: 400px;
}
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
.search-input {
  width: 100%;
  height: 42px;
  padding: 0 16px 0 38px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  font-size: 0.9rem;
  color: #0f172a;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.search-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.filter-pill {
  padding: 0.35rem 0.85rem;
  border-radius: 100px;
  background: white;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
}
.filter-pill:hover {
  transform: translateY(-1px);
  border-color: #cbd5e1;
}
.filter-pill.active {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.btn-icon {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  color: #475569;
  cursor: pointer;
  transition: all 0.25s ease;
}
.btn-icon:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

/* ==================== TABLE CONTAINER ==================== */
.table-container {
  background: white;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.02);
  overflow: hidden;
}

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.data-table thead th {
  background: #f8fafc;
  padding: 14px 16px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
  position: sticky;
  top: 0;
  z-index: 1;
}

.data-table tbody td {
  padding: 14px 16px;
  font-size: 0.9rem;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  vertical-align: middle;
}

.data-table tbody tr {
  transition: all 0.25s ease;
  cursor: pointer;
}

.data-table tbody tr:hover {
  background: #f8fafc;
  transform: translateY(-1px);
}

.data-table tbody tr.even-row {
  background: #fafbfc;
}

.data-table tbody tr.even-row:hover {
  background: #f1f5f9;
}

/* ==================== STATUS BADGE ==================== */
.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}
.status-badge.pending { background: #fef3c7; color: #92400e; }
.status-badge.review { background: #dbeafe; color: #1e40af; }
.status-badge.interview { background: #ede9fe; color: #6b21a8; }
.status-badge.accepted { background: #dcfce7; color: #166534; }
.status-badge.rejected { background: #fee2e2; color: #991b1b; }

/* ==================== BUTTON DETAIL ==================== */
.btn-detail {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #2563eb;
  color: white;
  border: none;
  padding: 5px 12px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}
.btn-detail:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

/* ==================== PAGINATION ==================== */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid #f1f5f9;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.pagination-info {
  font-size: 0.85rem;
  color: #64748b;
}
.pagination-controls {
  display: flex;
  gap: 0.25rem;
}
.page-btn {
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #334155;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
}
.page-btn:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: #cbd5e1;
}
.page-btn.active {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
}
.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ==================== SKELETON TABLE ==================== */
.skeleton-table {
  padding: 1rem;
}
.skeleton-header,
.skeleton-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 12px;
}
.shimmer-cell {
  height: 14px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}
.w-8 { width: 8%; }
.w-10 { width: 10%; }
.w-12 { width: 12%; }
.w-15 { width: 15%; }
.w-20 { width: 20%; }

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* ==================== ERROR & EMPTY ==================== */
.error-card,
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  margin: 1rem 0;
}
.error-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}
.btn-outline {
  border: 1px solid #cbd5e1;
  background: white;
  padding: 0.5rem 1.25rem;
  border-radius: 12px;
  font-weight: 500;
  color: #334155;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-outline:hover {
  background: #f8fafc;
}
.empty-illustration {
  margin-bottom: 1.5rem;
}
.empty-state h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.empty-state p {
  color: #64748b;
  margin-bottom: 1.5rem;
  max-width: 450px;
  margin-left: auto;
  margin-right: auto;
}
.btn-primary {
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.65rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.25s;
}
.btn-primary:hover {
  background: #1d4ed8;
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  .toolbar-right {
    justify-content: flex-start;
  }
  .page-title {
    font-size: 1.75rem;
  }
}
</style>