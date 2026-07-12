import axios from 'axios';
import type { Lamaran } from '../types/lamaran.types';

const BASE_URL = 'http://localhost:3000/api/profile';

export const lamaranRepository = {
  async getLamaranSaya(): Promise<Lamaran[]> {
    const token = localStorage.getItem('token');
    const response = await axios.get<{ success: boolean; message: string; data: Lamaran[] }>(
      `${BASE_URL}/lamaran-saya`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  },

  async getDetailLamaran(id: number): Promise<Lamaran> {
    const token = localStorage.getItem('token');
    const response = await axios.get<{ success: boolean; message: string; data: Lamaran }>(
      `${BASE_URL}/lamaran-saya/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  },
};