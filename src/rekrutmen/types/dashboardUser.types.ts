export interface Lowongan {
  id: number
  title: string
  lokasi: string
  perusahaan: string
  gajiMin: number
  gajiMax: number
  deskripsi: string
  tanggalPosting: string
}

export interface Lamaran {
  id: number
  lowonganId: number
  posisi: string
  stage: 'Apply' | 'Screening' | 'Interview' | 'Hiring'
  created_at: string
}

export interface DashboardStats {
  total: number
  screening: number
  interview: number
  hiring: number
}

export interface StatusBar {
  label: string
  value: number
}

export interface ApplyPayload {
  lowonganId: number
  posisi: string
  created_at: string
}