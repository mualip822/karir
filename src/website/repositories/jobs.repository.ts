import axios from 'axios';
import type { Job } from '../types/jobs.types';

console.log("API URL:", import.meta.env.VITE_API_URL);

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});

export interface JobTypeOption {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

export class JobsRepository {
  async getAll(): Promise<Job[]> {
    const { data } = await apiClient.get('/api/rekrutmen');
    if (!data.success) throw new Error(data.message || 'Gagal mengambil data');
    return this.mapLowongansToJobs(data.data);
  }

  async getJobTypes(): Promise<JobTypeOption[]> {
    const { data } = await apiClient.get('/api/rekrutmen/job-types');
    if (!data.success) throw new Error(data.message || 'Gagal mengambil tipe pekerjaan');
    return data.data;
  }

  private mapLowongansToJobs(lowongans: any[]): Job[] {
    return lowongans.map((item: any) => ({
      id: item.id,
      title: item.title,
      company: item.perusahaan,
      division: item.divisi || '',
      location: item.lokasi,
      type: item.tipe_pekerjaan?.name || 'Tidak Diketahui',
      salary: this.formatSalary(item.gaji_min, item.gaji_max),
      experience: item.pengalaman || 'Fresh Graduate',
      education: item.pendidikan || 'Minimal SMA/SMK',
      category: item.kategori?.name || '',
      aboutPosition: item.tentang_posisi,
      responsibilities: item.tanggung_jawab || [],
      requirements: item.persyaratan || [],
      benefits: item.benefit || [],
      skills: item.skills || [],
      deadline: item.deadline,
      postedAt: item.tanggal_posting || item.created_at,
      createdAt: item.created_at,
      is_active: item.is_active,
    }));
  }

  private formatSalary(min: number, max: number): string {
    const fmt = (val: number) => val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    if (min && max) return `Rp ${fmt(min)} – ${fmt(max)}`;
    if (min) return `Rp ${fmt(min)}`;
    if (max) return `Rp ${fmt(max)}`;
    return 'Negotiable';
  }
}

export default new JobsRepository();