export type LamaranStatus =
  | 'pending'
  | 'review'
  | 'interview'
  | 'accepted'
  | 'rejected';

export interface LamaranSummary {
  id: number;
  lowongan_id: number;
  posisi: string;
  lembaga: string;
  lokasi: string;
  status: LamaranStatus;
  created_at: string;
}

export interface Lowongan {
  id: number;
  title: string;
  divisi: string;
  lokasi: string;
  deskripsi?: string;
  tipePekerjaan: string;
  gajiMin: number;
  gajiMax: number;
  pengalaman: string;
  pendidikan?: string;
  perusahaan: string;
  tanggalPosting: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  review: number;
  interview: number;
  accepted: number;
  rejected: number;
}

export interface StatusBar {
  status: LamaranStatus;
  label: string;
  count: number;
  value: number;
}

export interface ActivityPoint {
  label: string;
  value: number;
}

export interface ProfileCompletion {
  percentage: number;
  filled: number;
  total: number;
  hint: string;
  missing: string[];
}