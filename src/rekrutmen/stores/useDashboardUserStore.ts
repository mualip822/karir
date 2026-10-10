/* ============================================================
   DASHBOARD USER STORE
   - Merge data profil dari BANYAK sumber biar 100% akurat
============================================================ */

import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import api from '../../shared/utils/axios';
import { dashboardUserRepository } from '../repositories/dashboardUserRepository';
import { useProfileStore } from './useProfileStore';
import { useAuthStore } from '../../auth/stores/useAuthStore';
import type {
  DashboardStats,
  StatusBar,
  LamaranSummary,
  ActivityPoint,
  ProfileCompletion,
} from '../types/dashboardUser.types';

const EMPTY_STATS: DashboardStats = {
  total: 0,
  pending: 0,
  review: 0,
  interview: 0,
  accepted: 0,
  rejected: 0,
};

const EMPTY_PROFILE: ProfileCompletion = {
  percentage: 0,
  filled: 0,
  total: 16,
  hint: '',
  missing: [],
};

/* ---------- Merge aman: hanya ambil field yang ada nilai ---------- */
const mergeProfileSources = (
  sources: Array<unknown>,
): Record<string, unknown> => {
  const merged: Record<string, unknown> = {};

  const walk = (obj: unknown, depth = 0): void => {
    if (depth > 3 || !obj || typeof obj !== 'object') return;

    if (Array.isArray(obj)) {
      for (const item of obj) walk(item, depth + 1);
      return;
    }

    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if (v === null || v === undefined) continue;
      if (typeof v === 'string' && v.trim() === '') continue;
      if (
        typeof v === 'object' &&
        !Array.isArray(v) &&
        Object.keys(v as object).length === 0
      ) {
        continue;
      }

      // Hanya set kalau belum ada (prioritas: source pertama menang)
      if (!(k in merged)) {
        merged[k] = v;
      }

      // Rekursif untuk nested object (biar tidak kehilangan field)
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        walk(v, depth + 1);
      }
    }
  };

  for (const src of sources) walk(src);
  return merged;
};

export const useDashboardUserStore = defineStore('dashboardUser', () => {
  /* ---------- State ---------- */
  const stats = ref<DashboardStats>({ ...EMPTY_STATS });
  const statusBars = ref<StatusBar[]>([]);
  const lamaranList = ref<LamaranSummary[]>([]);
  const activity = ref<ActivityPoint[]>([]);
  const profileCompletion = ref<ProfileCompletion>({ ...EMPTY_PROFILE });

  const loading = ref(false);
  const error = ref<string | null>(null);

  /* ---------- Ambil profil dari berbagai sumber ---------- */
  const collectProfileSources = async (): Promise<unknown[]> => {
    const sources: unknown[] = [];

    /* 1. Profile store */
    try {
      const profileStore = useProfileStore() as any;

      if (typeof profileStore?.fetchProfile === 'function') {
        await profileStore.fetchProfile();
      } else if (typeof profileStore?.loadProfile === 'function') {
        await profileStore.loadProfile();
      }

      const candidates = [
        profileStore?.profile,
        profileStore?.user,
        profileStore?.data,
        profileStore?.detail,
      ];

      for (const c of candidates) {
        if (c && typeof c === 'object' && Object.keys(c).length > 0) {
          sources.push(c);
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[DASHBOARD] Profile store failed:', err);
    }

    /* 2. API langsung */
    try {
      const { data } = await api.get('/profile');
      if (data && typeof data === 'object') {
        sources.push(data);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[DASHBOARD] GET /profile failed:', err);
    }

    /* 3. authStore.user */
    try {
      const auth = useAuthStore();
      if (auth.user && typeof auth.user === 'object') {
        sources.push(auth.user);
      }
    } catch {
      /* ignore */
    }

    /* 4. localStorage fallback */
    try {
      const keys = ['profile', 'user', 'user_profile', 'auth_user'];
      for (const k of keys) {
        const raw = localStorage.getItem(k);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
              sources.push(parsed);
            }
          } catch {
            /* ignore invalid JSON */
          }
        }
      }
    } catch {
      /* ignore */
    }

    return sources;
  };

  /* ---------- Actions ---------- */

  const loadData = async (): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const [lamaran, profileSources] = await Promise.all([
        dashboardUserRepository.getLamaranSaya(),
        collectProfileSources(),
      ]);

      lamaranList.value = lamaran;
      stats.value = dashboardUserRepository.computeStats(lamaran);
      statusBars.value = dashboardUserRepository.computeStatusBars(lamaran);
      activity.value = dashboardUserRepository.computeActivity(lamaran);

      const mergedProfile = mergeProfileSources(profileSources);

      // eslint-disable-next-line no-console
      console.log('[DASHBOARD] Profile sources count:', profileSources.length);
      // eslint-disable-next-line no-console
      console.log('[DASHBOARD] Merged profile:', mergedProfile);

      profileCompletion.value =
        dashboardUserRepository.computeProfileCompletion(mergedProfile);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        error.value =
          err.response?.data?.message ??
          err.message ??
          'Gagal memuat data';
      } else if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'Gagal memuat data';
      }
    } finally {
      loading.value = false;
    }
  };

  const clearError = (): void => {
    error.value = null;
  };

  return {
    stats,
    statusBars,
    lamaranList,
    activity,
    profileCompletion,
    loading,
    error,
    loadData,
    clearError,
  };
});