<template>
  <div class="dash">

    <!-- ==========================================================
         GREETING
    =========================================================== -->
    <header class="greeting">
      <div class="greeting-text">
        <span class="eyebrow">
          <span class="eyebrow-pulse"></span>
          {{ greeting }}
        </span>
        <h1 class="greeting-title">
          Halo, {{ firstName }}
          <span class="wave">👋</span>
        </h1>
        <p class="greeting-sub">
          Ini ringkasan perjalanan lamaranmu
          <span class="sep">·</span>
          <span class="greeting-date">{{ todayLabel }}</span>
        </p>
      </div>

      <div class="greeting-actions">
        <button
          type="button"
          class="btn btn-ghost"
          :disabled="loading"
          @click="reload"
        >
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            :class="{ spinning: loading }"
          >
            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
            <path d="M21 3v6h-6" />
          </svg>
          <span>{{ loading ? 'Memuat…' : 'Segarkan' }}</span>
        </button>
      </div>
    </header>

    <!-- ==========================================================
         QUICK PANELS
    =========================================================== -->
    <section class="quick-row">

      <!-- PRESENSI -->
      <div
        v-if="presensiVisible"
        class="quick-panel presensi-panel"
        :class="presensiState.className"
      >
        <div class="qp-head">
          <div class="qp-icon qp-icon-teal">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div class="qp-title-wrap">
            <span class="qp-eyebrow">Presensi Hari Ini</span>
            <strong class="qp-title">{{ presensiState.title }}</strong>
          </div>
        </div>

        <div v-if="presensiLoading" class="qp-skeleton">
          <div class="sk sk-sm" style="width: 40%"></div>
          <div class="sk sk-sm" style="width: 62%"></div>
        </div>

        <template v-else>
          <dl v-if="presensiState.hasData" class="qp-stats">
            <div class="qp-stat">
              <dt>Masuk</dt>
              <dd>{{ presensiState.jamMasuk }}</dd>
            </div>
            <div class="qp-stat">
              <dt>Pulang</dt>
              <dd>{{ presensiState.jamPulang }}</dd>
            </div>
          </dl>

          <p v-else class="qp-desc">{{ presensiState.desc }}</p>

          <router-link :to="{ name: 'user-presensi' }" class="qp-action">
            <span>{{ presensiState.cta }}</span>
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </router-link>
        </template>
      </div>

      <!-- CARI LOWONGAN -->
      <router-link
        :to="{ name: 'user-lowongan' }"
        class="quick-panel browse-panel"
      >
        <div class="qp-head">
          <div class="qp-icon qp-icon-blue">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <div class="qp-title-wrap">
            <span class="qp-eyebrow">Lowongan</span>
            <strong class="qp-title">Cari Peluang Baru</strong>
          </div>
        </div>
        <p class="qp-desc">
          Lihat lowongan yang cocok dengan keahlianmu.
        </p>
        <span class="qp-action">
          <span>Jelajahi Lowongan</span>
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </router-link>
    </section>

    <!-- ==========================================================
         STATISTIK
    =========================================================== -->
    <section class="stats">
      <div class="stat" data-tone="primary">
        <div class="stat-head">
          <span class="stat-icon">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <path d="M3 11h18" />
            </svg>
          </span>
          <span class="stat-label">Total Lamaran</span>
        </div>
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-desc">
          {{ stats.total === 0 ? 'Belum ada lamaran' : 'Lamaran terkirim' }}
        </div>
      </div>

      <div class="stat" data-tone="warning">
        <div class="stat-head">
          <span class="stat-icon">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </span>
          <span class="stat-label">Sedang Ditinjau</span>
        </div>
        <div class="stat-value">{{ stats.pending + stats.review }}</div>
        <div class="stat-desc">
          {{ stats.pending + stats.review === 0 ? 'Belum ada' : 'Menunggu kabar' }}
        </div>
      </div>

      <div class="stat" data-tone="info">
        <div class="stat-head">
          <span class="stat-icon">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          <span class="stat-label">Interview</span>
        </div>
        <div class="stat-value">{{ stats.interview }}</div>
        <div class="stat-desc">
          {{ stats.interview === 0 ? 'Belum ada' : 'Sedang berjalan' }}
        </div>
      </div>

      <div class="stat" data-tone="success">
        <div class="stat-head">
          <span class="stat-icon">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </span>
          <span class="stat-label">Diterima</span>
        </div>
        <div class="stat-value">{{ stats.accepted }}</div>
        <div class="stat-desc">
          {{ stats.accepted === 0 ? 'Belum ada' : 'Selamat!' }}
        </div>
      </div>
    </section>

    <!-- ==========================================================
         AKTIVITAS + PIPELINE
    =========================================================== -->
    <section class="grid-2">
      <div class="section">
        <div class="section-head">
          <div>
            <h2 class="section-title">Aktivitas Lamaran</h2>
            <p class="section-sub">
              Perkembangan lamaranmu · Jan – Des {{ currentYear }}
            </p>
          </div>
          <span class="section-meta">
            {{ totalActivity }} lamaran
          </span>
        </div>

        <div class="chart-wrap">
          <div class="chart-plot">
            <svg
              class="chart-svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              role="img"
              aria-label="Grafik aktivitas lamaran Januari sampai Desember"
            >
              <defs>
                <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#4f6ef7" stop-opacity="0.20" />
                  <stop offset="100%" stop-color="#4f6ef7" stop-opacity="0" />
                </linearGradient>
              </defs>

              <line
                v-for="(y, i) in gridLines"
                :key="'g' + i"
                x1="0"
                x2="100"
                :y1="y"
                :y2="y"
                class="chart-grid"
              />

              <path v-if="areaPath" :d="areaPath" class="chart-area" />
              <path
                v-if="linePath"
                :d="linePath"
                class="chart-line"
                vector-effect="non-scaling-stroke"
              />
            </svg>

            <div class="chart-dots">
              <span
                v-for="(p, i) in chartPoints"
                :key="'d' + i"
                class="chart-dot"
                :style="{ left: p.x + '%', top: p.y + '%' }"
                :data-value="`${p.value} lamaran`"
              ></span>
            </div>
          </div>

          <div class="chart-axis">
            <span
              v-for="(a, i) in activity"
              :key="'a' + i"
              class="axis-label"
            >
              {{ a.label }}
            </span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-head">
          <div>
            <h2 class="section-title">Tahapan Lamaran</h2>
            <p class="section-sub">Sebaran status saat ini</p>
          </div>
        </div>

        <ul class="pipeline">
          <li
            v-for="bar in statusBars"
            :key="bar.status"
            class="pipe-row"
          >
            <div class="pipe-meta">
              <span class="pipe-label">
                <span class="pipe-dot" :class="`tone-${bar.status}`"></span>
                {{ bar.label }}
              </span>
              <span class="pipe-count">{{ bar.count }}</span>
            </div>
            <div class="pipe-track">
              <div
                class="pipe-fill"
                :class="`tone-${bar.status}`"
                :style="{ width: bar.value + '%' }"
              ></div>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- ==========================================================
         LAMARAN TERBARU + KELENGKAPAN PROFIL
    =========================================================== -->
    <section class="grid-2">
      <div class="section">
        <div class="section-head">
          <div>
            <h2 class="section-title">Lamaran Terbaru</h2>
            <p class="section-sub">Lamaran yang paling kamu kirim</p>
          </div>
          <router-link :to="{ name: 'user-lamaran' }" class="section-link">
            Lihat semua
            <svg
              viewBox="0 0 24 24"
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </router-link>
        </div>

        <ul v-if="recentLamaran.length" class="app-list">
          <li v-for="item in recentLamaran" :key="item.id" class="app-row">
            <div class="app-mark" :class="`tone-${item.status}`">
              {{ initials(item.posisi) }}
            </div>
            <div class="app-body">
              <div class="app-title">{{ item.posisi }}</div>
              <div class="app-sub">
                {{ item.lembaga }}
                <span class="sep">·</span>
                {{ item.lokasi }}
              </div>
            </div>
            <div class="app-right">
              <span class="app-status" :class="`tone-${item.status}`">
                {{ statusLabel(item.status) }}
              </span>
              <span class="app-date">
                {{ formatDate(item.created_at) }}
              </span>
            </div>
          </li>
        </ul>

        <div v-else class="empty-mini">
          <div class="empty-icon">
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
          </div>
          <p class="empty-title">Belum ada lamaran</p>
          <p class="empty-desc">Yuk mulai kirim lamaran pertama kamu.</p>
          <router-link :to="{ name: 'user-lowongan' }" class="empty-cta">
            Cari Lowongan
          </router-link>
        </div>
      </div>

      <div class="section">
        <div class="section-head">
          <div>
            <h2 class="section-title">Kelengkapan Profil</h2>
            <p class="section-sub">Profil lengkap = peluang lebih besar</p>
          </div>
        </div>

        <div class="profile-block">
          <div class="profile-top">
            <span class="profile-value">
              {{ profileCompletion.percentage }}<span class="profile-pct">%</span>
            </span>
            <span class="profile-caption">
              {{ profileCompletion.filled }} dari {{ profileCompletion.total }} bagian
            </span>
          </div>

          <div class="profile-track">
            <div
              class="profile-fill"
              :class="{ 'is-full': profileCompletion.percentage >= 100 }"
              :style="{ width: profileCompletion.percentage + '%' }"
            ></div>
          </div>

          <p class="profile-hint">{{ profileCompletion.hint }}</p>

          <ul
            v-if="profileCompletion.missing.length > 0"
            class="profile-missing"
          >
            <li v-for="m in profileCompletion.missing.slice(0, 5)" :key="m">
              <span class="pm-dot"></span>
              <span>{{ m }}</span>
            </li>
            <li v-if="profileCompletion.missing.length > 5" class="pm-more">
              +{{ profileCompletion.missing.length - 5 }} data lainnya
            </li>
          </ul>

          <router-link
            :to="{ name: 'user-profile' }"
            class="btn btn-outline btn-full"
          >
            <span>
              {{ profileCompletion.percentage >= 100
                  ? 'Lihat Profil Saya'
                  : 'Lengkapi Profil Sekarang' }}
            </span>
            <svg
              viewBox="0 0 24 24"
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ==========================================================
         TOAST
    =========================================================== -->
    <transition name="toast">
      <div v-if="error" class="toast" role="alert" @click="clearError">
        <span class="toast-dot"></span>
        <span class="toast-text">{{ error }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  onBeforeUnmount,
  ref,
  watch,
} from 'vue';
import { storeToRefs } from 'pinia';
import { useDashboardUserStore } from '../stores/useDashboardUserStore';
import { useAuthStore } from '../../auth/stores/useAuthStore';
import presensiService from '../../modules/presensi/services/presensiService';
import type { LamaranStatus } from '../types/dashboardUser.types';

/* ============================================================
   STORE
============================================================ */
const store = useDashboardUserStore();
const authStore = useAuthStore();

const {
  stats,
  statusBars,
  lamaranList,
  activity,
  profileCompletion,
  loading,
  error,
} = storeToRefs(store);

/* ============================================================
   STATE
============================================================ */
const now = ref(new Date());
let clockTimer: number | null = null;
let toastTimer: number | null = null;

const currentYear = computed(() => now.value.getFullYear());

/* ============================================================
   PRESENSI
============================================================ */
interface PresensiToday {
  isActiveEmployee?: boolean;
  employee?: { nama?: string } | null;
  presensi?: {
    jamMasuk?: string | null;
    jamPulang?: string | null;
  } | null;
}

const presensiLoading = ref(true);
const presensi = ref<PresensiToday | null>(null);

const loadPresensi = async (): Promise<void> => {
  presensiLoading.value = true;
  try {
    const data = (await presensiService.getToday()) as PresensiToday;
    presensi.value = data ?? null;
  } catch {
    presensi.value = null;
  } finally {
    presensiLoading.value = false;
  }
};

const presensiVisible = computed(() => {
  if (presensiLoading.value) return true;
  if (!presensi.value) return false;
  return presensi.value.isActiveEmployee !== false;
});

const presensiState = computed(() => {
  const jamMasuk = presensi.value?.presensi?.jamMasuk ?? null;
  const jamPulang = presensi.value?.presensi?.jamPulang ?? null;

  if (!jamMasuk) {
    return {
      className: 'is-pending',
      title: 'Kamu belum presensi',
      desc: 'Yuk catat kehadiranmu hari ini.',
      cta: 'Presensi Sekarang',
      hasData: false,
      jamMasuk: '—',
      jamPulang: '—',
    };
  }

  if (!jamPulang) {
    return {
      className: 'is-working',
      title: 'Sedang bekerja',
      desc: 'Jangan lupa presensi pulang nanti.',
      cta: 'Buka Presensi',
      hasData: true,
      jamMasuk: formatTime(jamMasuk),
      jamPulang: '—',
    };
  }

  return {
    className: 'is-done',
    title: 'Presensi lengkap',
    desc: 'Terima kasih sudah presensi hari ini.',
    cta: 'Buka Presensi',
    hasData: true,
    jamMasuk: formatTime(jamMasuk),
    jamPulang: formatTime(jamPulang),
  };
});

/* ============================================================
   SAPAAN
============================================================ */
const firstName = computed(() => {
  const user = authStore.user as any;
  const name =
    user?.name ||
    user?.nama ||
    user?.full_name ||
    user?.fullName ||
    'Pelamar';
  return String(name).trim().split(/\s+/)[0] || 'Pelamar';
});

const greeting = computed(() => {
  const h = now.value.getHours();
  if (h < 11) return 'Selamat pagi';
  if (h < 15) return 'Selamat siang';
  if (h < 19) return 'Selamat sore';
  return 'Selamat malam';
});

const todayLabel = computed(() =>
  now.value.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
);

/* ============================================================
   LIST SLICE
============================================================ */
const recentLamaran = computed(() => lamaranList.value.slice(0, 4));

/* ============================================================
   LINE CHART JAN - DES
============================================================ */
const CHART_PAD = 6;
const CHART_INNER = 100 - 2 * CHART_PAD;

const totalActivity = computed(() =>
  activity.value.reduce((sum, p) => sum + p.value, 0),
);

const maxActivity = computed(() =>
  Math.max(1, ...activity.value.map((p) => p.value)),
);

interface ChartPoint {
  x: number;
  y: number;
  value: number;
}

const chartPoints = computed<ChartPoint[]>(() => {
  const list = activity.value;
  const n = list.length;
  if (n === 0) return [];

  const stepX = n > 1 ? CHART_INNER / (n - 1) : 0;

  return list.map((p, i) => {
    const x = CHART_PAD + stepX * i;
    const y =
      CHART_PAD + CHART_INNER - (p.value / maxActivity.value) * CHART_INNER;
    return { x, y, value: p.value };
  });
});

const gridLines = computed<number[]>(() => {
  const lines: number[] = [];
  for (let i = 0; i <= 4; i++) {
    lines.push(CHART_PAD + (CHART_INNER / 4) * i);
  }
  return lines;
});

const linePath = computed(() => {
  const pts = chartPoints.value;
  if (pts.length < 2) return '';

  let d = '';
  for (let i = 0; i < pts.length; i++) {
    const cur = pts[i];
    if (!cur) continue;

    if (i === 0) {
      d += `M ${cur.x.toFixed(2)} ${cur.y.toFixed(2)}`;
    } else {
      const prev = pts[i - 1];
      if (!prev) continue;
      const cx = ((prev.x + cur.x) / 2).toFixed(2);
      d += ` C ${cx} ${prev.y.toFixed(2)}, ${cx} ${cur.y.toFixed(
        2,
      )}, ${cur.x.toFixed(2)} ${cur.y.toFixed(2)}`;
    }
  }
  return d;
});

const areaPath = computed(() => {
  const pts = chartPoints.value;
  if (pts.length < 2) return '';

  const first = pts.at(0);
  const last = pts.at(-1);
  if (!first || !last) return '';

  const baseY = 100;

  let d = `M ${first.x.toFixed(2)} ${baseY} `;
  for (let i = 0; i < pts.length; i++) {
    const cur = pts[i];
    if (!cur) continue;

    if (i === 0) {
      d += `L ${cur.x.toFixed(2)} ${cur.y.toFixed(2)}`;
    } else {
      const prev = pts[i - 1];
      if (!prev) continue;
      const cx = ((prev.x + cur.x) / 2).toFixed(2);
      d += ` C ${cx} ${prev.y.toFixed(2)}, ${cx} ${cur.y.toFixed(
        2,
      )}, ${cur.x.toFixed(2)} ${cur.y.toFixed(2)}`;
    }
  }
  d += ` L ${last.x.toFixed(2)} ${baseY} Z`;
  return d;
});

/* ============================================================
   HELPERS
============================================================ */
const initials = (text: string): string => {
  if (!text) return '?';
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    const a = words.at(0) ?? '';
    const b = words.at(1) ?? '';
    const r = (a.charAt(0) + b.charAt(0)).toUpperCase();
    return r || '?';
  }
  return text.slice(0, 2).toUpperCase() || '?';
};

const STATUS_LABEL: Record<LamaranStatus, string> = {
  pending: 'Menunggu',
  review: 'Ditinjau',
  interview: 'Interview',
  accepted: 'Diterima',
  rejected: 'Ditolak',
};

const statusLabel = (s: LamaranStatus): string => STATUS_LABEL[s] ?? s;

const formatDate = (iso: string): string => {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (iso: string | null | undefined): string => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/* ============================================================
   ACTIONS
============================================================ */
const reload = async (): Promise<void> => {
  await Promise.all([store.loadData(), loadPresensi()]);
};

const clearError = (): void => {
  store.clearError();
};

/* ============================================================
   TOAST AUTO-DISMISS
============================================================ */
watch(error, (v) => {
  if (toastTimer !== null) window.clearTimeout(toastTimer);
  if (v) {
    toastTimer = window.setTimeout(() => store.clearError(), 4200);
  }
});

/* ============================================================
   LIFECYCLE
============================================================ */
onMounted(async () => {
  clockTimer = window.setInterval(() => {
    now.value = new Date();
  }, 60_000);

  await reload();
});

onBeforeUnmount(() => {
  if (clockTimer !== null) window.clearInterval(clockTimer);
  if (toastTimer !== null) window.clearTimeout(toastTimer);
});
</script>

<style scoped>
/* ============================================================
   DESIGN TOKENS — 2026 SaaS
============================================================ */
.dash {
  --accent: #4f6ef7;
  --accent-ink: #3352e0;
  --accent-soft: #eef2ff;
  --accent-border: #cdd7ff;

  --teal: #0d9488;
  --teal-soft: #f0fdfa;
  --teal-border: #99f6e4;

  --success: #10b981;
  --success-ink: #047857;
  --success-soft: #ecfdf5;
  --success-border: #a7f3d0;

  --warning: #f59e0b;
  --warning-ink: #b45309;
  --warning-soft: #fffbeb;
  --warning-border: #fde68a;

  --danger: #ef4444;
  --danger-ink: #b91c1c;
  --danger-soft: #fef2f2;
  --danger-border: #fecaca;

  --violet: #8b5cf6;
  --violet-soft: #f5f3ff;
  --violet-border: #ddd6fe;

  --text-primary: #0a1526;
  --text-secondary: #5a6b85;
  --text-muted: #8a97ad;

  --surface: #ffffff;
  --surface-2: #fafbfd;
  --surface-3: #f3f5fa;

  --border: #e6e9f0;
  --border-soft: #eef1f6;
  --border-strong: #d4dae6;

  --r-sm: 10px;
  --r-md: 12px;
  --r-lg: 16px;
  --r-xl: 20px;

  --shadow-xs: 0 1px 2px rgba(10, 21, 38, 0.04);
  --shadow-sm: 0 1px 3px rgba(10, 21, 38, 0.05),
    0 1px 2px rgba(10, 21, 38, 0.03);
  --shadow-md: 0 8px 24px -10px rgba(10, 21, 38, 0.10),
    0 2px 6px -2px rgba(10, 21, 38, 0.04);

  display: flex;
  flex-direction: column;
  gap: 20px;

  color: var(--text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, sans-serif;
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11', 'ss01';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ============================================================
   GREETING
============================================================ */
.greeting {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  padding: 4px 0;
}
.greeting-text { min-width: 0; }

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 10px;
}
.eyebrow-pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--success);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15); }
  50% { box-shadow: 0 0 0 5px rgba(16, 185, 129, 0.05); }
}

.greeting-title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: var(--text-primary);
}
.wave {
  display: inline-block;
  transform-origin: 70% 70%;
  animation: wave 2.6s ease-in-out infinite;
}
@keyframes wave {
  0%, 60%, 100% { transform: rotate(0deg); }
  10%, 30% { transform: rotate(14deg); }
  20%, 40% { transform: rotate(-8deg); }
}

.greeting-sub {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--text-secondary);
}
.greeting-date {
  color: var(--text-primary);
  font-weight: 500;
}

.sep { margin: 0 6px; color: var(--text-muted); }
.greeting-actions { display: flex; gap: 8px; flex-shrink: 0; }

/* ============================================================
   BUTTONS
============================================================ */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  height: 38px;
  padding: 0 14px;
  border-radius: var(--r-md);
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: -0.005em;
  cursor: pointer;
  border: 1px solid transparent;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.16s ease, border-color 0.16s ease,
    color 0.16s ease, box-shadow 0.16s ease, transform 0.12s ease;
}
.btn:active:not(:disabled) { transform: translateY(1px); }
.btn:disabled { opacity: 0.55; cursor: not-allowed; }

.btn-ghost {
  background: var(--surface);
  color: var(--text-secondary);
  border-color: var(--border);
  box-shadow: var(--shadow-xs);
}
.btn-ghost:hover:not(:disabled) {
  color: var(--text-primary);
  border-color: var(--border-strong);
  background: var(--surface-2);
}

.btn-outline {
  background: var(--surface);
  color: var(--accent);
  border-color: var(--accent-border);
}
.btn-outline:hover { background: var(--accent-soft); }
.btn-full { width: 100%; }

.spinning { animation: spin 0.9s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ============================================================
   QUICK ROW
============================================================ */
.quick-row {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
  gap: 16px;
}
@media (max-width: 860px) {
  .quick-row { grid-template-columns: 1fr; }
}

.quick-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 18px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-xs);
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease,
    transform 0.2s ease;
}
.quick-panel:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}
.quick-panel::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--teal);
  border-radius: 3px 0 0 3px;
}
.presensi-panel.is-working::before { background: var(--accent); }
.presensi-panel.is-done::before { background: var(--success); }
.browse-panel::before { background: var(--accent); }

.qp-head { display: flex; align-items: center; gap: 12px; }
.qp-icon {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.qp-icon-teal {
  background: var(--teal-soft);
  color: var(--teal);
  border: 1px solid var(--teal-border);
}
.qp-icon-blue {
  background: var(--accent-soft);
  color: var(--accent);
  border: 1px solid var(--accent-border);
}
.qp-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}
.qp-eyebrow {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.qp-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.015em;
  line-height: 1.3;
}
.qp-desc {
  margin: 0;
  font-size: 12.5px;
  color: var(--text-secondary);
  line-height: 1.55;
}
.qp-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 0;
}
.qp-stat { display: flex; flex-direction: column; gap: 4px; }
.qp-stat dt {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.qp-stat dd {
  margin: 0;
  font-size: 19px;
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.025em;
}

.qp-action {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
  padding: 9px 12px;
  border-radius: var(--r-md);
  background: var(--surface-2);
  border: 1px solid var(--border-soft);
  font-size: 12.5px;
  font-weight: 600;
  color: var(--teal);
  text-decoration: none;
  transition: background 0.16s ease, color 0.16s ease,
    border-color 0.16s ease;
}
.browse-panel .qp-action { color: var(--accent); }
.quick-panel:hover .qp-action {
  background: var(--accent-soft);
  border-color: var(--accent-border);
}
.presensi-panel:hover .qp-action {
  background: var(--teal-soft);
  border-color: var(--teal-border);
}

.qp-skeleton {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 4px 0;
}
.sk {
  background: linear-gradient(
    90deg,
    #eef2f7 0%,
    #f8fafc 50%,
    #eef2f7 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
  border-radius: 6px;
}
.sk-sm { height: 12px; }
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ============================================================
   STATISTIK
============================================================ */
.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}
@media (max-width: 900px) {
  .stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

.stat {
  position: relative;
  padding: 16px 18px 17px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-xs);
  transition: border-color 0.2s ease, box-shadow 0.2s ease,
    transform 0.2s ease;
}
.stat:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.stat-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.stat-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat[data-tone='primary'] .stat-icon {
  background: var(--accent-soft);
  color: var(--accent);
}
.stat[data-tone='warning'] .stat-icon {
  background: var(--warning-soft);
  color: var(--warning-ink);
}
.stat[data-tone='info'] .stat-icon {
  background: var(--violet-soft);
  color: var(--violet);
}
.stat[data-tone='success'] .stat-icon {
  background: var(--success-soft);
  color: var(--success-ink);
}

.stat-label {
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--text-secondary);
  text-transform: uppercase;
}
.stat-value {
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  margin-bottom: 9px;
}
.stat-desc { font-size: 12px; color: var(--text-muted); }

/* ============================================================
   SECTION SHELL
============================================================ */
.grid-2 {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}
@media (max-width: 900px) {
  .grid-2 { grid-template-columns: 1fr; }
}

.section {
  padding: 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-xs);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.section-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.section-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}
.section-sub {
  margin: 4px 0 0;
  font-size: 12.5px;
  color: var(--text-muted);
}
.section-meta {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--accent);
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--accent-soft);
  border: 1px solid var(--accent-border);
  white-space: nowrap;
  align-self: flex-start;
}
.section-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
  text-decoration: none;
  padding: 6px 8px;
  border-radius: 8px;
  transition: background 0.16s ease;
  white-space: nowrap;
}
.section-link:hover { background: var(--accent-soft); }

/* ============================================================
   LINE CHART
============================================================ */
.chart-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.chart-plot {
  position: relative;
  width: 100%;
  height: 220px;
}
.chart-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  overflow: visible;
}
.chart-grid {
  stroke: var(--border-soft);
  stroke-width: 1;
  stroke-dasharray: 2 4;
  vector-effect: non-scaling-stroke;
}
.chart-area {
  fill: url(#chart-area-grad);
  stroke: none;
}
.chart-line {
  fill: none;
  stroke: var(--accent);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
}
.chart-dots {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.chart-dot {
  position: absolute;
  width: 9px;
  height: 9px;
  margin: -4.5px 0 0 -4.5px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid var(--accent);
  box-sizing: border-box;
  pointer-events: auto;
  cursor: pointer;
  transition: transform 0.16s ease, box-shadow 0.16s ease;
}
.chart-dot:hover {
  transform: scale(1.4);
  box-shadow: 0 0 0 4px rgba(79, 110, 247, 0.15);
}
.chart-dot::after {
  content: attr(data-value);
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 9px;
  border-radius: 6px;
  background: var(--text-primary);
  color: #ffffff;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.01em;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.16s ease;
}
.chart-dot:hover::after { opacity: 1; }

.chart-axis {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 0;
}
.axis-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  text-align: center;
  line-height: 1;
  text-transform: capitalize;
  letter-spacing: -0.005em;
}

/* ============================================================
   PIPELINE
============================================================ */
.pipeline {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.pipe-row { display: flex; flex-direction: column; gap: 8px; }
.pipe-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.pipe-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text-secondary);
}
.pipe-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.pipe-count {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}
.pipe-track {
  height: 6px;
  background: var(--border-soft);
  border-radius: 999px;
  overflow: hidden;
}
.pipe-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.tone-pending { background: var(--warning); }
.tone-review { background: var(--violet); }
.tone-interview { background: var(--accent); }
.tone-accepted { background: var(--success); }
.tone-rejected { background: var(--danger); }

/* ============================================================
   LAMARAN TERBARU
============================================================ */
.app-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}
.app-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid var(--border-soft);
}
.app-row:first-child { border-top: none; padding-top: 0; }
.app-row:last-child { padding-bottom: 0; }
.app-mark {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #ffffff;
  text-transform: uppercase;
}
.app-mark.tone-pending { background: var(--warning); }
.app-mark.tone-review { background: var(--violet); }
.app-mark.tone-interview { background: var(--accent); }
.app-mark.tone-accepted { background: var(--success); }
.app-mark.tone-rejected { background: var(--danger); }

.app-body { flex: 1; min-width: 0; }
.app-title {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.005em;
  line-height: 1.35;
}
.app-sub {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.app-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
  flex-shrink: 0;
}
.app-status {
  display: inline-flex;
  align-items: center;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 3px 9px;
  border-radius: 6px;
  white-space: nowrap;
  color: #ffffff;
}
.app-status.tone-pending { background: var(--warning); }
.app-status.tone-review { background: var(--violet); }
.app-status.tone-interview { background: var(--accent); }
.app-status.tone-accepted { background: var(--success); }
.app-status.tone-rejected { background: var(--danger); }
.app-date {
  font-size: 11px;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

/* ============================================================
   KELENGKAPAN PROFIL
============================================================ */
.profile-block { display: flex; flex-direction: column; gap: 12px; }
.profile-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}
.profile-value {
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.035em;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.profile-pct {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-muted);
  margin-left: 2px;
}
.profile-caption {
  font-size: 11.5px;
  color: var(--text-muted);
  font-weight: 500;
}
.profile-track {
  height: 8px;
  background: var(--border-soft);
  border-radius: 999px;
  overflow: hidden;
}
.profile-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--teal) 0%, var(--accent) 100%);
  border-radius: 999px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.profile-fill.is-full {
  background: linear-gradient(90deg, var(--teal) 0%, var(--success) 100%);
}
.profile-hint {
  margin: 0;
  font-size: 12.5px;
  color: var(--text-secondary);
  line-height: 1.5;
}
.profile-missing {
  list-style: none;
  margin: 0;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  background: var(--surface-2);
  border: 1px solid var(--border-soft);
  border-radius: var(--r-md);
}
.profile-missing li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
}
.pm-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--warning);
  flex-shrink: 0;
}
.pm-more {
  font-style: italic;
  color: var(--text-muted);
  padding-left: 14px;
}

/* ============================================================
   EMPTY
============================================================ */
.empty-mini {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 28px 16px;
  text-align: center;
}
.empty-icon {
  width: 46px;
  height: 46px;
  border-radius: 13px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  margin-bottom: 2px;
}
.empty-title {
  margin: 0;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-primary);
}
.empty-desc {
  margin: 0;
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.5;
  max-width: 260px;
}
.empty-cta {
  display: inline-flex;
  align-items: center;
  height: 32px;
  margin-top: 4px;
  padding: 0 14px;
  border-radius: var(--r-sm);
  background: var(--accent-soft);
  border: 1px solid var(--accent-border);
  color: var(--accent);
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.16s ease, color 0.16s ease;
}
.empty-cta:hover { background: var(--accent); color: #ffffff; }

/* ============================================================
   TOAST
============================================================ */
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 60;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: min(92vw, 420px);
  padding: 12px 16px;
  border-radius: var(--r-lg);
  background: #ffffff;
  border: 1px solid var(--danger-border);
  color: var(--danger-ink);
  font-size: 13px;
  font-weight: 500;
  box-shadow: var(--shadow-md);
  cursor: pointer;
}
.toast-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--danger);
  flex-shrink: 0;
}
.toast-text { line-height: 1.4; }
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 8px);
}

/* ============================================================
   RESPONSIVE
============================================================ */
@media (max-width: 720px) {
  .dash { gap: 16px; }

  .greeting {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .greeting-title { font-size: 22px; }

  .quick-row { gap: 12px; }
  .stats { gap: 10px; }
  .stat { padding: 14px 16px; }
  .stat-value { font-size: 26px; }
  .section { padding: 16px; }

  .chart-plot { height: 180px; }

  .chart-axis .axis-label:nth-child(even) {
    visibility: hidden;
  }

  .app-row { padding: 10px 0; }

  .toast {
    left: 16px;
    right: 16px;
    bottom: 16px;
    transform: none;
    max-width: none;
  }
  .toast-enter-from,
  .toast-leave-to { transform: translateY(8px); }
}

@media (max-width: 420px) {
  .greeting-title { font-size: 20px; }
  .qp-stat dd { font-size: 17px; }
  .stat-value { font-size: 24px; }
  .chart-plot { height: 160px; }
  .axis-label { font-size: 9.5px; }
}

@media (prefers-reduced-motion: reduce) {
  .sk,
  .wave,
  .eyebrow-pulse,
  .spinning { animation: none; }
  .pipe-fill,
  .profile-fill { transition: none; }
  .quick-panel:hover,
  .stat:hover { transform: none; }
}
</style>