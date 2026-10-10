export type VerificationMethod =
  | "MANUAL"
  | "FOTO"
  | "FACE_RECOGNITION";

export type PresensiStatus =
  | "HADIR"
  | "TERLAMBAT"
  | "IZIN"
  | "SAKIT"
  | "ALPHA"
  | "LIBUR";

export interface PresensiEmployee {
  id: string;
  nama: string;
  email?: string | null;
  foto?: string | null;
  posisi?: string | null;
  jabatan?: string | null;
  statusKaryawan?: string | null;
  nipy?: string | null;
}

export interface PresensiShift {
  id: string;
  nama: string;
  kode?: string | null;
  jamMasuk: string;
  jamPulang: string;
  toleransiMenit: number;
  lintasHari: boolean;
  status: string;
}

export interface Presensi {
  id: string;
  employeeId: string;
  tanggal: string;

  shiftId?: string | null;
  shift?: PresensiShift | null;

  jamMasuk?: string | null;
  jamPulang?: string | null;

  lokasiMasukLat?: number | null;
  lokasiMasukLng?: number | null;

  lokasiPulangLat?: number | null;
  lokasiPulangLng?: number | null;

  alamatMasuk?: string | null;
  alamatPulang?: string | null;

  fotoMasuk?: string | null;
  fotoPulang?: string | null;

  metodeMasuk?: VerificationMethod | string | null;
  metodePulang?: VerificationMethod | string | null;

  faceVerifiedMasuk?: boolean;
  faceVerifiedPulang?: boolean;

  faceSimilarityMasuk?: number | null;
  faceSimilarityPulang?: number | null;

  status: PresensiStatus | string;

  menitTerlambat: number;
  menitPulangCepat: number;
  menitLembur: number;

  catatan?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface TodayPresensiResponse {
  isEmployee: boolean;
  isActiveEmployee: boolean;
  employee: PresensiEmployee | null;
  presensi: Presensi | null;
  shift: PresensiShift | null;
}

export interface PresensiHistoryResponse {
  data?: Presensi[];
  items?: Presensi[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

export interface FaceStatus {
  registered: boolean;
  faceId?: string | null;
  fotoPath?: string | null;
  verifiedAt?: string | null;
}

export interface FaceRegisterResponse {
  registered: boolean;
  faceId?: string | null;
  fotoPath?: string | null;
  similarity?: number | null;
  confidence?: number | null;
  real?: boolean;
  live?: boolean;
}

export interface FaceVerifyResponse {
  matched: boolean;
  similarity: number;
  threshold: number;
  confidence?: number;
  real?: boolean;
  live?: boolean;
}

export interface PresensiActionResponse {
  presensi?: Presensi;
  message?: string;
}