export interface ApplyPayload {
  lowongan_id: number;

  expected_location: string;
  priority_first?: number;

  motivasi: string;
  motivasi_skala: number;

  gaji: string;
  deskripsi: string;

  jelaskan_diri: string;

  rutin_kajian: string;
  ustadz_kajian?: string;

  ulama_internasional: string;
  ulama_indonesia: string;

  situs_islam: string;
  media_rujukan: string;

  sumber_info: string;
  sumber_info_lain?: string;

  hobi: string;
  riwayat_sakit: string;

  mulai_kerja: string;
  siap_bekerja: string;
}

export interface UploadFiles {
  cv: File | null;
  ijazah: File | null;
  transkrip: File | null;
  pendukung?: File | null;
}