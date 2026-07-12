import { defineStore } from 'pinia';
import { lamaranService } from '../services/lamaranService';
import type { Lamaran } from '../types/lamaran.types';
import axios from 'axios';

export const useLamaranStore = defineStore('lamaran', {
  state: () => ({
    lamaran: [] as Lamaran[],
    detail: null as Lamaran | null,
    loading: false,
    detailLoading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchLamaranSaya() {
      this.loading = true;
      this.error = null;
      try {
        const data = await lamaranService.fetchLamaranSaya();
        this.lamaran = data;
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          this.error = err.response?.data?.message || err.message;
        } else if (err instanceof Error) {
          this.error = err.message;
        } else {
          this.error = 'Terjadi kesalahan';
        }
      } finally {
        this.loading = false;
      }
    },
    async fetchDetailLamaran(id: number) {
      this.detailLoading = true;
      this.error = null;
      try {
        const data = await lamaranService.fetchDetailLamaran(id);
        this.detail = data;
        return data;
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          this.error = err.response?.data?.message || err.message;
        } else if (err instanceof Error) {
          this.error = err.message;
        } else {
          this.error = 'Terjadi kesalahan';
        }
        throw err;
      } finally {
        this.detailLoading = false;
      }
    },
  },
});