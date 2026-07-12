import { lamaranRepository } from '../repositories/lamaranRepository';
import type { Lamaran } from '../types/lamaran.types';

export const lamaranService = {
  async fetchLamaranSaya(): Promise<Lamaran[]> {
    return lamaranRepository.getLamaranSaya();
  },
  async fetchDetailLamaran(id: number): Promise<Lamaran> {
    return lamaranRepository.getDetailLamaran(id);
  },
};