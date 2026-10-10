<template>
  <div class="detail">

    <!-- ==========================================================
         TOPBAR
    =========================================================== -->
    <div class="topbar">
      <button
        type="button"
        class="back-btn"
        aria-label="Kembali"
        @click="$router.push({ name: 'user-lamaran' })"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Kembali</span>
      </button>

      <div v-if="detail" class="topbar-info">
        <span class="topbar-title">{{ detail.posisi }}</span>
        <span class="topbar-pill" :class="`pill-${detail.status}`">
          {{ statusLabel(detail.status) }}
        </span>
      </div>
    </div>

    <!-- ==========================================================
         SKELETON
    =========================================================== -->
    <div v-if="store.detailLoading" class="skeleton">
      <div class="sk-hero"></div>
      <div class="sk-grid">
        <div v-for="n in 4" :key="n" class="sk-block"></div>
      </div>
    </div>

    <!-- ==========================================================
         ERROR
    =========================================================== -->
    <div v-else-if="store.error" class="error-box">
      <div class="error-mark">!</div>
      <h3 class="error-title">Terjadi Kesalahan</h3>
      <p class="error-desc">{{ store.error }}</p>
      <button class="btn btn-secondary" type="button" @click="fetchDetail">
        Coba Lagi
      </button>
    </div>

    <!-- ==========================================================
         CONTENT
    =========================================================== -->
    <template v-else-if="detail">

      <!-- HERO -->
      <header class="hero">
        <div class="hero-main">
          <span class="hero-eyebrow">Detail Lamaran</span>
          <h1 class="hero-title">{{ detail.posisi }}</h1>
          <p class="hero-sub">
            {{ detail.lembaga }}
            <span class="dot-sep">·</span>
            {{ detail.lokasi }}
          </p>
        </div>

        <div class="hero-side">
          <span class="hero-status" :class="`pill-${detail.status}`">
            {{ statusLabel(detail.status) }}
          </span>
          <span class="hero-date">
            Dilamar {{ formatDate(detail.created_at) }}
          </span>
        </div>
      </header>

      <!-- METRICS -->
      <section class="metrics">
        <div class="metric">
          <span class="metric-icon metric-icon--blue">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </span>
          <div class="metric-body">
            <span class="metric-label">Posisi</span>
            <strong class="metric-value">{{ detail.posisi || '—' }}</strong>
          </div>
        </div>

        <div class="metric">
          <span class="metric-icon metric-icon--indigo">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
            </svg>
          </span>
          <div class="metric-body">
            <span class="metric-label">Lembaga</span>
            <strong class="metric-value">{{ detail.lembaga || '—' }}</strong>
          </div>
        </div>

        <div class="metric">
          <span class="metric-icon metric-icon--teal">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
          <div class="metric-body">
            <span class="metric-label">Lokasi</span>
            <strong class="metric-value">{{ detail.lokasi || '—' }}</strong>
          </div>
        </div>

        <div class="metric">
          <span class="metric-icon metric-icon--amber">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </span>
          <div class="metric-body">
            <span class="metric-label">Gaji Diharapkan</span>
            <strong class="metric-value">
              {{ detail.gaji ? 'Rp ' + detail.gaji.toLocaleString('id-ID') : '—' }}
            </strong>
          </div>
        </div>
      </section>

      <!-- LAYOUT -->
      <div class="layout">

        <!-- MAIN -->
        <div class="main">

          <!-- DATA PRIBADI -->
          <section class="card">
            <header class="card-head">
              <h2 class="card-title">Data Pribadi</h2>
              <span class="card-sub">Identitas & kontak</span>
            </header>

            <dl class="info">
              <div><dt>Nama Lengkap</dt><dd>{{ detail.nama_lengkap || '—' }}</dd></div>
              <div><dt>Email</dt><dd>{{ detail.email || '—' }}</dd></div>
              <div><dt>NIK</dt><dd class="is-mono">{{ detail.nik || '—' }}</dd></div>
              <div><dt>No HP</dt><dd class="is-mono">{{ detail.no_hp || '—' }}</dd></div>
              <div><dt>Tempat Lahir</dt><dd>{{ detail.tempat_lahir || '—' }}</dd></div>
              <div><dt>Tanggal Lahir</dt><dd>{{ formatDate(detail.tanggal_lahir) }}</dd></div>
              <div><dt>Agama</dt><dd>{{ detail.agama || '—' }}</dd></div>
              <div><dt>Jenis Kelamin</dt><dd>{{ detail.jenis_kelamin || '—' }}</dd></div>
              <div><dt>Status Menikah</dt><dd>{{ detail.status_menikah || '—' }}</dd></div>
              <div><dt>Pendidikan</dt><dd>{{ detail.pendidikan_terakhir || '—' }}</dd></div>
            </dl>
          </section>

          <!-- ALAMAT -->
          <section class="card">
            <header class="card-head">
              <h2 class="card-title">Alamat</h2>
              <span class="card-sub">Domisili</span>
            </header>

            <dl class="info">
              <div><dt>Provinsi</dt><dd>{{ detail.provinsi || '—' }}</dd></div>
              <div><dt>Kota</dt><dd>{{ detail.kota || '—' }}</dd></div>
              <div><dt>Kecamatan</dt><dd>{{ detail.kecamatan || '—' }}</dd></div>
              <div class="full"><dt>Alamat Lengkap</dt><dd>{{ detail.alamat_lengkap || '—' }}</dd></div>
            </dl>
          </section>

          <!-- TENTANG DIRI -->
          <section class="card">
            <header class="card-head">
              <h2 class="card-title">Tentang Diri</h2>
              <span class="card-sub">Motivasi & deskripsi</span>
            </header>

            <dl class="info">
              <div class="full"><dt>Motivasi</dt><dd>{{ detail.motivasi || '—' }}</dd></div>
              <div><dt>Skala Motivasi</dt><dd>{{ detail.motivasi_skala ?? '—' }}/10</dd></div>
              <div><dt>Gaji</dt><dd>{{ detail.gaji ? 'Rp ' + detail.gaji.toLocaleString('id-ID') : '—' }}</dd></div>
              <div class="full"><dt>Jelaskan Diri</dt><dd>{{ detail.jelaskan_diri || '—' }}</dd></div>
              <div class="full"><dt>Pengabdian</dt><dd>{{ detail.pengabdian || '—' }}</dd></div>
              <div class="full"><dt>Deskripsi</dt><dd>{{ detail.deskripsi || '—' }}</dd></div>
            </dl>
          </section>

          <!-- KAJIAN -->
          <section class="card">
            <header class="card-head">
              <h2 class="card-title">Kajian & Referensi</h2>
              <span class="card-sub">Aktivitas keagamaan</span>
            </header>

            <dl class="info">
              <div><dt>Rutin Kajian</dt><dd>{{ detail.rutin_kajian ? 'Ya' : 'Tidak' }}</dd></div>
              <div><dt>Ustadz Kajian</dt><dd>{{ detail.ustadz_kajian || '—' }}</dd></div>
              <div><dt>Ulama Indonesia</dt><dd>{{ detail.ulama_indonesia || '—' }}</dd></div>
              <div><dt>Ulama Internasional</dt><dd>{{ detail.ulama_internasional || '—' }}</dd></div>
              <div><dt>Situs Islam</dt><dd>{{ detail.situs_islam || '—' }}</dd></div>
              <div><dt>Media Rujukan</dt><dd>{{ detail.media_rujukan || '—' }}</dd></div>
            </dl>
          </section>

          <!-- DOKUMEN -->
          <section class="card">
            <header class="card-head">
              <h2 class="card-title">Dokumen</h2>
              <span class="card-sub">Berkas terlampir</span>
            </header>

            <div class="docs">
              <div
                v-for="doc in documents"
                :key="doc.key"
                class="doc"
                :class="{ 'has-file': !!doc.file }"
              >
                <div class="doc-head">
                  <span class="doc-icon" :class="{ 'is-ready': !!doc.file }">
                    <svg v-if="doc.file" viewBox="0 0 24 24" width="12" height="12"
                      fill="none" stroke="currentColor" stroke-width="2.5"
                      stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <svg v-else viewBox="0 0 24 24" width="12" height="12"
                      fill="none" stroke="currentColor" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </span>
                  <span class="doc-label">{{ doc.label }}</span>
                </div>

                <div v-if="doc.file" class="doc-actions">
                  <a :href="doc.file" target="_blank" class="doc-link">Lihat</a>
                  <a :href="doc.file" download class="doc-link">Unduh</a>
                </div>

                <span v-else class="doc-empty">Tidak tersedia</span>
              </div>
            </div>
          </section>
        </div>

        <!-- SIDEBAR -->
        <aside class="side">

          <!-- INFORMASI LAMARAN -->
          <section class="side-card">
            <header class="side-head">
              <h2 class="side-title">Informasi Lamaran</h2>
            </header>

            <dl class="side-info">
              <div><dt>Posisi</dt><dd>{{ detail.posisi || '—' }}</dd></div>
              <div><dt>Lembaga</dt><dd>{{ detail.lembaga || '—' }}</dd></div>
              <div><dt>Lokasi</dt><dd>{{ detail.lokasi || '—' }}</dd></div>
              <div><dt>Expected Location</dt><dd>{{ detail.expected_location || '—' }}</dd></div>
              <div><dt>Prioritas Pertama</dt><dd>{{ detail.priority_first || '—' }}</dd></div>
              <div><dt>Tanggal Melamar</dt><dd>{{ formatDate(detail.created_at) }}</dd></div>
            </dl>
          </section>

          <!-- MEDIA SOSIAL -->
          <section class="side-card">
            <header class="side-head">
              <h2 class="side-title">Media Sosial</h2>
            </header>

            <ul v-if="hasSocial" class="socials">
              <li v-if="detail.instagram" class="social">
                <span class="social-label">Instagram</span>
                <a :href="toSocialUrl('ig', detail.instagram)" target="_blank" class="social-value">
                  {{ detail.instagram }}
                </a>
              </li>
              <li v-if="detail.tiktok" class="social">
                <span class="social-label">TikTok</span>
                <a :href="toSocialUrl('tiktok', detail.tiktok)" target="_blank" class="social-value">
                  {{ detail.tiktok }}
                </a>
              </li>
              <li v-if="detail.linkedin" class="social">
                <span class="social-label">LinkedIn</span>
                <a :href="toSocialUrl('li', detail.linkedin)" target="_blank" class="social-value">
                  {{ detail.linkedin }}
                </a>
              </li>
              <li v-if="detail.twitter" class="social">
                <span class="social-label">Twitter / X</span>
                <a :href="toSocialUrl('tw', detail.twitter)" target="_blank" class="social-value">
                  {{ detail.twitter }}
                </a>
              </li>
            </ul>

            <p v-else class="side-empty">Tidak ada media sosial</p>
          </section>

          <!-- INFORMASI TAMBAHAN -->
          <section class="side-card">
            <header class="side-head">
              <h2 class="side-title">Informasi Tambahan</h2>
            </header>

            <dl class="side-info">
              <div><dt>Sumber Info</dt><dd>{{ detail.sumber_info || '—' }}</dd></div>
              <div><dt>Sumber Info Lain</dt><dd>{{ detail.sumber_info_lain || '—' }}</dd></div>
              <div><dt>Hobi</dt><dd>{{ detail.hobi || '—' }}</dd></div>
              <div><dt>Riwayat Sakit</dt><dd>{{ detail.riwayat_sakit || '—' }}</dd></div>
              <div><dt>Mulai Kerja</dt><dd>{{ formatDate(detail.mulai_kerja) }}</dd></div>
              <div><dt>Siap Bekerja</dt><dd>{{ detail.siap_bekerja ? 'Ya' : 'Tidak' }}</dd></div>
            </dl>
          </section>
        </aside>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useLamaranStore } from '../stores/useLamaranStore';
import type { Lamaran } from '../types/lamaran.types';

const route = useRoute();
const store = useLamaranStore();

const API_HOST = (import.meta.env.VITE_API_URL || '').replace('/api', '');
const id = Number(route.params.id);

const detail = computed<Lamaran | null>(() => store.detail);

const documents = computed(() => {
  const files = [
    { key: 'cv', label: 'CV', raw: detail.value?.cv_file },
    { key: 'ijazah', label: 'Ijazah', raw: detail.value?.ijazah_file },
    { key: 'transkrip', label: 'Transkrip', raw: detail.value?.transkrip_file },
    { key: 'pendukung', label: 'Pendukung', raw: detail.value?.pendukung_file },
  ];

  return files.map((doc) => ({
    key: doc.key,
    label: doc.label,
    file: doc.raw ? `${API_HOST}/uploads/apply/${doc.raw}` : null,
  }));
});

const hasSocial = computed(() => {
  return !!(
    detail.value?.instagram ||
    detail.value?.tiktok ||
    detail.value?.linkedin ||
    detail.value?.twitter
  );
});

const statusLabel = (status: string): string => {
  const map: Record<string, string> = {
    pending: 'Menunggu',
    review: 'Ditinjau',
    interview: 'Interview',
    accepted: 'Diterima',
    rejected: 'Ditolak',
  };
  return map[status] || status;
};

const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

const toSocialUrl = (type: string, value: string): string => {
  const v = String(value).trim();
  if (/^https?:\/\//i.test(v)) return v;

  const handle = v.replace(/^@/, '');

  switch (type) {
    case 'ig':
      return `https://instagram.com/${handle}`;
    case 'tiktok':
      return `https://tiktok.com/@${handle}`;
    case 'li':
      return `https://linkedin.com/in/${handle}`;
    case 'tw':
      return `https://twitter.com/${handle}`;
    default:
      return v;
  }
};

const fetchDetail = async (): Promise<void> => {
  try {
    await store.fetchDetailLamaran(id);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

onMounted(() => {
  fetchDetail();
});
</script>

<style scoped>
/* ============================================================
   TOKENS
============================================================ */
.detail {
  --primary: #2f6bff;
  --primary-hover: #2457d6;
  --primary-soft: #eef2ff;
  --primary-border: #dbe3ff;

  --success: #16a34a;
  --success-soft: #ecfdf5;
  --warning: #ea580c;
  --warning-soft: #fff7ed;
  --info: #4f46e5;
  --info-soft: #eef2ff;
  --danger: #dc2626;
  --danger-soft: #fef2f2;

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
  --r-xl: 12px;

  color: var(--text);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, sans-serif;
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11', 'ss01';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  display: flex;
  flex-direction: column;
  gap: 14px;

  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
}

/* ============================================================
   TOPBAR
============================================================ */
.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: saturate(180%) blur(10px);
  -webkit-backdrop-filter: saturate(180%) blur(10px);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: 0 1px 3px rgba(13, 27, 42, 0.03);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  height: 30px;
  padding: 0 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.back-btn:hover {
  color: var(--text);
  background: var(--surface-muted);
  border-color: #d5dae2;
}

.topbar-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
  min-width: 0;
  overflow: hidden;
}

.topbar-title {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 320px;
}

.topbar-pill {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ============================================================
   HERO
============================================================ */
.hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  padding: 20px 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
}

.hero-main { min-width: 0; flex: 1; }

.hero-eyebrow {
  display: inline-block;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.hero-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.2;
  color: var(--text);
}

.hero-sub {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.dot-sep { margin: 0 4px; color: var(--text-faint); }

.hero-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
}

.hero-status {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.hero-date {
  font-size: 11.5px;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.pill-pending { background: var(--warning-soft); color: var(--warning); }
.pill-review { background: var(--info-soft); color: var(--info); }
.pill-interview { background: var(--primary-soft); color: var(--primary); }
.pill-accepted { background: var(--success-soft); color: var(--success); }
.pill-rejected { background: var(--danger-soft); color: var(--danger); }

/* ============================================================
   METRICS
============================================================ */
.metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

@media (max-width: 900px) {
  .metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 480px) {
  .metrics { grid-template-columns: 1fr; }
}

.metric {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  transition: border-color 0.15s ease;
}

.metric:hover { border-color: #d5dae2; }

.metric-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-icon--blue {
  background: var(--primary-soft);
  color: var(--primary);
  border: 1px solid var(--primary-border);
}

.metric-icon--indigo {
  background: var(--info-soft);
  color: var(--info);
  border: 1px solid #dbe1ff;
}

.metric-icon--teal {
  background: #ecfdf5;
  color: #0d9488;
  border: 1px solid #b8e6e0;
}

.metric-icon--amber {
  background: #fef3c7;
  color: #b45309;
  border: 1px solid #fde68a;
}

.metric-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.metric-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.metric-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  line-height: 1.3;
  word-break: break-word;
}

/* ============================================================
   LAYOUT
============================================================ */
.layout {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(300px, 1fr);
  gap: 14px;
  align-items: start;
}

@media (max-width: 1080px) {
  .layout { grid-template-columns: 1fr; }
}

.main, .side {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}

/* ============================================================
   CARDS (MAIN)
============================================================ */
.card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
}

.card-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-soft);
}

.card-title {
  margin: 0;
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text);
  line-height: 1.3;
}

.card-sub {
  font-size: 11.5px;
  color: var(--text-muted);
  white-space: nowrap;
}

/* INFO */
.info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
}

.info > div {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 14px;
  align-items: start;
}

.info dt {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  line-height: 1.5;
  padding-top: 1px;
}

.info dd {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  line-height: 1.5;
  word-break: break-word;
  white-space: pre-line;
}

.info dd.is-mono {
  font-variant-numeric: tabular-nums;
}

@media (max-width: 520px) {
  .info > div {
    grid-template-columns: 1fr;
    gap: 2px;
  }
  .info dt { font-size: 11px; }
}

/* ============================================================
   DOKUMEN
============================================================ */
.docs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

@media (max-width: 720px) {
  .docs { grid-template-columns: 1fr; }
}

.doc {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 14px;
  background: var(--surface-muted);
  border: 1px solid var(--border-soft);
  border-radius: var(--r-md);
  transition: border-color 0.15s ease;
}

.doc.has-file {
  background: var(--surface);
  border-color: var(--border);
}

.doc.has-file:hover { border-color: #d5dae2; }

.doc-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.doc-icon {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--surface-muted);
  color: var(--text-faint);
  border: 1px solid var(--border-soft);
}

.doc-icon.is-ready {
  background: var(--success-soft);
  color: var(--success);
  border-color: #bbf7d0;
}

.doc-label {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text);
}

.doc-actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.doc-link {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  font-size: 11px;
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
  transition: all 0.15s ease;
}

.doc-link:hover {
  background: var(--primary);
  color: #ffffff;
  border-color: var(--primary);
}

.doc-empty {
  font-size: 11.5px;
  color: var(--text-muted);
}

/* ============================================================
   SIDEBAR CARDS
============================================================ */
.side-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 18px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
}

.side-head {
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-soft);
}

.side-title {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text);
}

.side-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
}

.side-info > div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.side-info dt {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.side-info dd {
  margin: 0;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text);
  line-height: 1.5;
  word-break: break-word;
  white-space: pre-line;
}

/* SOCIALS */
.socials {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.social {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.social-label {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.social-value {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--primary);
  text-decoration: none;
  word-break: break-all;
  line-height: 1.4;
  transition: color 0.15s ease;
}

.social-value:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

.side-empty {
  margin: 0;
  font-size: 12px;
  color: var(--text-muted);
}

/* ============================================================
   SKELETON
============================================================ */
.skeleton {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.sk-hero {
  height: 100px;
  background: linear-gradient(90deg, #eef2f7, #f8fafc, #eef2f7);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
  border-radius: var(--r-lg);
  border: 1px solid var(--border);
}

.sk-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.sk-block {
  height: 140px;
  background: linear-gradient(90deg, #eef2f7, #f8fafc, #eef2f7);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
  border-radius: var(--r-lg);
  border: 1px solid var(--border);
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ============================================================
   ERROR
============================================================ */
.error-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  padding: 40px 24px;
  background: var(--surface);
  border: 1px solid var(--danger-soft);
  border-radius: var(--r-lg);
}

.error-mark {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--danger-soft);
  color: var(--danger);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
}

.error-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
}

.error-desc {
  margin: 0 0 8px;
  font-size: 12.5px;
  color: var(--text-secondary);
  max-width: 320px;
  line-height: 1.5;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0 14px;
  border-radius: var(--r-md);
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s ease;
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

/* ============================================================
   RESPONSIVE
============================================================ */
@media (max-width: 720px) {
  .topbar {
    padding: 6px 8px;
    gap: 8px;
  }

  .topbar-title { max-width: 140px; font-size: 12px; }

  .back-btn span { display: none; }
  .back-btn {
    width: 30px;
    height: 30px;
    padding: 0;
    justify-content: center;
  }

  .hero {
    padding: 16px 18px;
    gap: 14px;
  }

  .hero-title { font-size: 19px; }

  .hero-side {
    align-items: flex-start;
    flex-direction: row;
    gap: 10px;
    flex-wrap: wrap;
    width: 100%;
  }

  .card { padding: 16px; gap: 12px; }
  .side-card { padding: 14px 16px; gap: 10px; }
}

@media (prefers-reduced-motion: reduce) {
  .sk-hero,
  .sk-block { animation: none; }
  .back-btn,
  .doc-link,
  .social-value,
  .card,
  .side-card,
  .metric { transition: none; }
}
</style>