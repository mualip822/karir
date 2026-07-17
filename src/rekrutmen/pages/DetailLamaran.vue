<template>
  <div class="detail-lamaran-page">
    <div class="container py-4">
      <!-- Tombol Kembali -->
      <button @click="$router.push({ name: 'user-lamaran' })" class="btn btn-back mb-3">
        ← Kembali ke Lamaran Saya
      </button>

      <!-- Loading Skeleton -->
      <div v-if="store.detailLoading" class="skeleton-container">
        <div class="skeleton-card" v-for="n in 4" :key="n">
          <div class="skeleton-line w-50 mb-2"></div>
          <div class="skeleton-line w-75 mb-2"></div>
          <div class="skeleton-line w-25"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="store.error" class="error-card">
        <div class="error-icon">⚠️</div>
        <h4>Terjadi Kesalahan</h4>
        <p>{{ store.error }}</p>
        <button @click="fetchDetail()" class="btn btn-outline-modern">
          Coba Lagi
        </button>
      </div>

      <!-- Konten Detail -->
      <div v-else-if="detail" class="paper">
        <!-- Header -->
        <div class="paper-header">
          <h1 class="paper-title">Detail Lamaran</h1>
          <p class="paper-subtitle">Informasi lengkap lamaran pekerjaan Anda</p>
          <div class="paper-status">
            <span :class="['status-badge', detail.status]">{{ statusLabel(detail.status) }}</span>
          </div>
        </div>

        <!-- Grid 2 kolom -->
        <div class="paper-grid">
          <!-- Kolom Kiri -->
          <div class="paper-column">
            <!-- Data Pribadi -->
            <div class="paper-section">
              <h6 class="section-heading">Data Pribadi</h6>
              <dl class="info-list">
                <dt>Nama Lengkap</dt><dd>{{ detail.nama_lengkap }}</dd>
                <dt>Email</dt><dd>{{ detail.email }}</dd>
                <dt>NIK</dt><dd>{{ detail.nik }}</dd>
                <dt>No HP</dt><dd>{{ detail.no_hp }}</dd>
                <dt>Tempat Lahir</dt><dd>{{ detail.tempat_lahir }}</dd>
                <dt>Tanggal Lahir</dt><dd>{{ formatDate(detail.tanggal_lahir) }}</dd>
                <dt>Agama</dt><dd>{{ detail.agama }}</dd>
                <dt>Jenis Kelamin</dt><dd>{{ detail.jenis_kelamin }}</dd>
                <dt>Status Menikah</dt><dd>{{ detail.status_menikah }}</dd>
              </dl>
            </div>

            <!-- Alamat -->
            <div class="paper-section">
              <h6 class="section-heading">Alamat</h6>
              <dl class="info-list">
                <dt>Provinsi</dt><dd>{{ detail.provinsi }}</dd>
                <dt>Kota</dt><dd>{{ detail.kota }}</dd>
                <dt>Kecamatan</dt><dd>{{ detail.kecamatan }}</dd>
                <dt>Alamat Lengkap</dt><dd>{{ detail.alamat_lengkap }}</dd>
              </dl>
            </div>

            <!-- Pendidikan -->
            <div class="paper-section">
              <h6 class="section-heading">Pendidikan</h6>
              <dl class="info-list">
                <dt>Pendidikan Terakhir</dt><dd>{{ detail.pendidikan_terakhir }}</dd>
              </dl>
            </div>

            <!-- Media Sosial -->
            <div class="paper-section">
              <h6 class="section-heading">Media Sosial</h6>
              <dl class="info-list">
                <dt>Instagram</dt><dd>{{ detail.instagram || '-' }}</dd>
                <dt>TikTok</dt><dd>{{ detail.tiktok || '-' }}</dd>
                <dt>LinkedIn</dt><dd>{{ detail.linkedin || '-' }}</dd>
                <dt>Twitter</dt><dd>{{ detail.twitter || '-' }}</dd>
              </dl>
            </div>
          </div>

          <!-- Kolom Kanan -->
          <div class="paper-column">
            <!-- Informasi Lamaran -->
            <div class="paper-section">
              <h6 class="section-heading">Informasi Lamaran</h6>
              <dl class="info-list">
                <dt>Posisi</dt><dd>{{ detail.posisi }}</dd>
                <dt>Lembaga</dt><dd>{{ detail.lembaga }}</dd>
                <dt>Lokasi</dt><dd>{{ detail.lokasi }}</dd>
                <dt>Expected Location</dt><dd>{{ detail.expected_location || '-' }}</dd>
                <dt>Prioritas Pertama</dt><dd>{{ detail.priority_first }}</dd>
                <dt>Tanggal Melamar</dt><dd>{{ formatDate(detail.created_at) }}</dd>
              </dl>
            </div>

            <!-- Tentang Diri -->
            <div class="paper-section">
              <h6 class="section-heading">Tentang Diri</h6>
              <dl class="info-list">
                <dt>Motivasi</dt><dd>{{ detail.motivasi }}</dd>
                <dt>Skala Motivasi</dt><dd>{{ detail.motivasi_skala }}/10</dd>
                <dt>Jelaskan Diri</dt><dd>{{ detail.jelaskan_diri }}</dd>
                <dt>Pengabdian</dt><dd>{{ detail.pengabdian }}</dd>
                <dt>Gaji (Rp)</dt><dd>{{ detail.gaji?.toLocaleString('id-ID') }}</dd>
                <dt>Deskripsi</dt><dd>{{ detail.deskripsi }}</dd>
              </dl>
            </div>

            <!-- Kajian & Referensi -->
            <div class="paper-section">
              <h6 class="section-heading">Kajian & Referensi</h6>
              <dl class="info-list">
                <dt>Rutin Kajian</dt><dd>{{ detail.rutin_kajian ? 'Ya' : 'Tidak' }}</dd>
                <dt>Ustadz Kajian</dt><dd>{{ detail.ustadz_kajian || '-' }}</dd>
                <dt>Ulama Indonesia</dt><dd>{{ detail.ulama_indonesia }}</dd>
                <dt>Ulama Internasional</dt><dd>{{ detail.ulama_internasional || '-' }}</dd>
                <dt>Situs Islam</dt><dd>{{ detail.situs_islam || '-' }}</dd>
                <dt>Media Rujukan</dt><dd>{{ detail.media_rujukan || '-' }}</dd>
              </dl>
            </div>

            <!-- Informasi Tambahan -->
            <div class="paper-section">
              <h6 class="section-heading">Informasi Tambahan</h6>
              <dl class="info-list">
                <dt>Sumber Info</dt><dd>{{ detail.sumber_info }}</dd>
                <dt>Sumber Info Lain</dt><dd>{{ detail.sumber_info_lain || '-' }}</dd>
                <dt>Hobi</dt><dd>{{ detail.hobi || '-' }}</dd>
                <dt>Riwayat Sakit</dt><dd>{{ detail.riwayat_sakit || '-' }}</dd>
                <dt>Mulai Kerja</dt><dd>{{ formatDate(detail.mulai_kerja) }}</dd>
                <dt>Siap Bekerja</dt><dd>{{ detail.siap_bekerja ? 'Ya' : 'Tidak' }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <!-- Dokumen (full width) -->
        <div class="paper-section mt-4">
          <h6 class="section-heading">Dokumen</h6>
          <div class="d-flex flex-wrap gap-3">
            <div v-for="doc in documents" :key="doc.key" class="document-item">
              <span class="doc-label">{{ doc.label }}</span>
              <div v-if="doc.file" class="d-flex gap-2 mt-1">
                <a :href="doc.file" target="_blank" class="doc-link">Lihat</a>
                <a :href="doc.file" download class="doc-link">Download</a>
              </div>
              <span v-else class="text-muted">Tidak tersedia</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useLamaranStore } from "../stores/useLamaranStore";
import type { Lamaran } from "../types/lamaran.types";

const route = useRoute();
const store = useLamaranStore();

// ==========================================
// API HOST (untuk akses /uploads)
// Development : http://localhost:3000
// Production  : https://behris-production.up.railway.app
// ==========================================
const API_HOST = import.meta.env.VITE_API_URL.replace("/api", "");

const id = Number(route.params.id);

const detail = computed<Lamaran | null>(() => store.detail);

const documents = computed(() => {
  const files = [
    {
      key: "cv",
      label: "CV",
      raw: detail.value?.cv_file,
    },
    {
      key: "ijazah",
      label: "Ijazah",
      raw: detail.value?.ijazah_file,
    },
    {
      key: "transkrip",
      label: "Transkrip",
      raw: detail.value?.transkrip_file,
    },
    {
      key: "pendukung",
      label: "Pendukung",
      raw: detail.value?.pendukung_file,
    },
  ];

  return files.map((doc) => ({
    key: doc.key,
    label: doc.label,
    file: doc.raw
      ? `${API_HOST}/uploads/apply/${doc.raw}`
      : null,
  }));
});

const statusLabel = (status: string) => {
  const map: Record<string, string> = {
    pending: "Pending",
    review: "Review",
    interview: "Interview",
    accepted: "Diterima",
    rejected: "Ditolak",
  };

  return map[status] || status;
};

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return "-";

  const date = new Date(dateStr);

  if (isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const fetchDetail = async () => {
  try {
    await store.fetchDetailLamaran(id);
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  fetchDetail();
});
</script>

<style scoped>
/* Background halaman */
.detail-lamaran-page {
  background: #f8fafc;
  min-height: 100vh;
}

/* Tombol Kembali */
.btn-back {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 8px 16px;
  color: #334155;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-back:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

/* Skeleton sementara */
.skeleton-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}
.skeleton-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}
.skeleton-line {
  height: 14px;
  background: #e2e8f0;
  border-radius: 8px;
  animation: pulse 1.5s infinite;
}
.w-50 { width: 50%; }
.w-75 { width: 75%; }
.w-25 { width: 25%; }
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* Error Card */
.error-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  border: 1px solid #fecaca;
  max-width: 400px;
  margin: 0 auto;
}
.error-icon {
  font-size: 2rem;
  margin-bottom: 12px;
}
.btn-outline-modern {
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 8px 20px;
  background: white;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-outline-modern:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
}

/* Dokumen A4 Style */
.paper {
  background: white;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  padding: 32px;
  max-width: 900px;
  margin: 0 auto;
}

.paper-header {
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.paper-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px;
}

.paper-subtitle {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0 0 12px;
}

.paper-status {
  margin-top: 8px;
}

.status-badge {
  padding: 4px 16px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.pending { background: #fef3c7; color: #92400e; }
.status-badge.review { background: #dbeafe; color: #1e40af; }
.status-badge.interview { background: #ede9fe; color: #6b21a8; }
.status-badge.accepted { background: #d1fae5; color: #065f46; }
.status-badge.rejected { background: #fee2e2; color: #991b1b; }

/* Grid 2 kolom */
.paper-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
}

@media (max-width: 768px) {
  .paper-grid {
    grid-template-columns: 1fr;
  }
  .paper {
    padding: 20px;
  }
}

.paper-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-heading {
  font-size: 0.85rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f5f9;
}

.info-list {
  margin: 0;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4px 12px;
  font-size: 0.875rem;
}

.info-list dt {
  font-weight: 600;
  color: #334155;
  white-space: nowrap;
}

.info-list dd {
  margin: 0;
  color: #475569;
  word-break: break-word;
}

/* Dokumen */
.document-item {
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px 16px;
  min-width: 100px;
}
.doc-label {
  font-weight: 600;
  font-size: 0.85rem;
  color: #334155;
}
.doc-link {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 4px 12px;
  font-size: 0.8rem;
  color: #1e293b;
  text-decoration: none;
  transition: all 0.2s;
}
.doc-link:hover {
  background: #e2e8f0;
}
</style>