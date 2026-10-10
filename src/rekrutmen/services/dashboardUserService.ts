/* ============================================================
   DASHBOARD USER SERVICE
   - Lamaran pakai lamaranService yang sudah jalan
   - Lowongan TIDAK di-fetch di sini (pakai useJobs di store)
============================================================ */

import api from '../../shared/utils/axios';
import { lamaranService } from './lamaranService';

/* ---------- Raw shape dari backend ---------- */
export interface RawLamaran {
  id: number;
  lowongan_id: number;
  posisi: string;
  lembaga: string;
  lokasi: string;
  status: 'pending' | 'review' | 'interview' | 'accepted' | 'rejected';
  created_at: string;
  updated_at?: string;
}

/* ---------- Helper unwrap envelope ---------- */
const unwrap = <T>(payload: any): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data as T;
  }
  return payload as T;
};

export const dashboardUserService = {
  async fetchLamaranSaya(): Promise<RawLamaran[]> {
    const list = await lamaranService.fetchLamaranSaya();
    return Array.isArray(list) ? (list as unknown as RawLamaran[]) : [];
  },

  async applyLowongan(lowonganId: number) {
    const { data } = await api.post('/lamaran', {
      lowongan_id: lowonganId,
    });
    return unwrap<{ id: number }>(data);
  },
};