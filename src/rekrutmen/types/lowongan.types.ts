// src/types/lowongan.types.ts

export type TipePekerjaan =
  | 'Full-time'
  | 'Paruh Waktu'

export interface Lowongan {
  id: number

  // BASIC
  title: string
  perusahaan: string
  divisi: string
  lokasi: string

  // DETAIL
  deskripsi: string
  persyaratan: string[]
  tanggungJawab: string[]
  benefit: string[]

  // JOB INFO
  tipePekerjaan: TipePekerjaan
  pengalaman: string
  pendidikan: string

  // SALARY
  gajiMin: number
  gajiMax: number

  // EXTRA
  tanggalPosting: string
  featured?: boolean

  // UI CARD
  applicants?: number
  skills?: string[]
}

export interface PengalamanKerja {
  perusahaan: string
  posisi: string
  tahun: string
  deskripsi: string
}

export interface Lamaran {
  // LOWONGAN
  lowonganId: number
  lowonganTitle: string

  // DATA DIRI
  nama: string
  email: string
  noHp: string
  tglLahir: string
  jenisKelamin: string
  alamat: string

  // PENDIDIKAN
  pendidikanTerakhir: string
  institusi: string
  tahunLulus: string

  // PENGALAMAN
  pengalamanKerja: PengalamanKerja[]

  // FILE
  cvFile?: File | null
  portofolioUrl?: string

  // TAMBAHAN
  motivasi: string
  harapanGaji: number
}