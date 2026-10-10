/* ============================================================
   DASHBOARD USER REPOSITORY
============================================================ */

import {
  dashboardUserService,
  type RawLamaran,
} from '../services/dashboardUserService';

import type {
  LamaranSummary,
  DashboardStats,
  StatusBar,
  ActivityPoint,
  ProfileCompletion,
  LamaranStatus,
} from '../types/dashboardUser.types';

/* ---------- Konstanta ---------- */

const STATUS_ORDER: LamaranStatus[] = [
  'pending',
  'review',
  'interview',
  'accepted',
  'rejected',
];

const STATUS_LABEL: Record<LamaranStatus, string> = {
  pending: 'Menunggu',
  review: 'Ditinjau',
  interview: 'Interview',
  accepted: 'Diterima',
  rejected: 'Ditolak',
};

const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

/* ---------- Field grup untuk kelengkapan profil ----------
   Setiap grup punya BANYAK alias key untuk mengakomodasi
   variasi nama field di backend (GET vs PUT, snake vs camel).
   Pencarian dilakukan secara RECURSIVE (deep search).
---------------------------------------------------------- */
interface ProfileFieldGroup {
  label: string;
  keys: string[];
}

const PROFILE_FIELDS: ProfileFieldGroup[] = [
  {
    label: 'NIK',
    keys: ['nik'],
  },
  {
    label: 'Nama Lengkap',
    keys: ['nama', 'name', 'full_name', 'fullName', 'nama_lengkap', 'namaLengkap'],
  },
  {
    label: 'Email',
    keys: ['email', 'email_address', 'emailAddress'],
  },
  {
    label: 'No HP',
    keys: [
      'hp',
      'no_hp',
      'nohp',
      'noHp',
      'noHP',
      'phone',
      'phone_number',
      'phoneNumber',
      'telepon',
      'telephone',
      'no_telepon',
      'noTelepon',
      'nomor_hp',
      'nomorHp',
      'nomor_telepon',
      'nomorTelepon',
      'mobile',
      'whatsapp',
      'wa',
    ],
  },
  {
    label: 'Tempat Lahir',
    keys: ['tempat_lahir', 'tempatLahir', 'birth_place', 'birthPlace', 'kota_lahir'],
  },
  {
    label: 'Tanggal Lahir',
    keys: [
      'tanggal_lahir',
      'tglLahir',
      'tgl_lahir',
      'tanggalLahir',
      'birth_date',
      'birthDate',
      'dob',
    ],
  },
  {
    label: 'Jenis Kelamin',
    keys: [
      'jenis_kelamin',
      'jenisKelamin',
      'gender',
      'sex',
      'jk',
    ],
  },
  {
    label: 'Agama',
    keys: ['agama', 'religion'],
  },
  {
    label: 'Status Pernikahan',
    keys: [
      'status_pernikahan',
      'status_menikah',
      'statusMenikah',
      'statusPernikahan',
      'marital_status',
      'maritalStatus',
      'pernikahan',
      'nikah',
    ],
  },
  {
    label: 'Pendidikan Terakhir',
    keys: [
      'pendidikan',
      'pendidikan_terakhir',
      'pendidikanTerakhir',
      'last_education',
      'lastEducation',
      'education',
      'edu',
      'jenjang',
    ],
  },
  {
    label: 'Provinsi',
    keys: ['provinsi', 'province', 'propinsi', 'state'],
  },
  {
    label: 'Kota/Kabupaten',
    keys: ['kota', 'kabupaten', 'city', 'regency'],
  },
  {
    label: 'Kecamatan',
    keys: ['kecamatan', 'district', 'subdistrict', 'kec'],
  },
  {
    label: 'Kode Pos',
    keys: ['kode_pos', 'kodePos', 'kodepos', 'zip', 'zipcode', 'zip_code', 'postal_code', 'postalCode', 'postcode'],
  },
  {
    label: 'Alamat Lengkap',
    keys: [
      'alamat',
      'alamat_lengkap',
      'alamatLengkap',
      'address',
      'full_address',
      'fullAddress',
      'street',
      'jalan',
    ],
  },
  {
    label: 'Media Sosial',
    keys: [
      'instagram',
      'facebook',
      'fb',
      'linkedin',
      'twitter',
      'tiktok',
      'social_media',
      'socialMedia',
    ],
  },
];

/* ---------- Transformers ---------- */

const toLamaranSummary = (raw: RawLamaran): LamaranSummary => ({
  id: raw.id,
  lowongan_id: raw.lowongan_id,
  posisi: raw.posisi,
  lembaga: raw.lembaga,
  lokasi: raw.lokasi,
  status: raw.status,
  created_at: raw.created_at,
});

/* ---------- Helpers ---------- */

const hasValue = (v: unknown): boolean => {
  if (v === null || v === undefined) return false;
  if (typeof v === 'string') return v.trim() !== '' && v.trim() !== '-';
  if (typeof v === 'number') return true;
  if (typeof v === 'boolean') return true;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === 'object') return Object.keys(v as object).length > 0;
  return false;
};

/* Deep search: cari key di seluruh level objek (max 4 level) */
const findValueDeep = (
  obj: unknown,
  keys: string[],
  depth = 0,
): { found: boolean; value: unknown } => {
  if (depth > 4 || obj === null || obj === undefined) {
    return { found: false, value: null };
  }

  if (typeof obj !== 'object') {
    return { found: false, value: null };
  }

  if (Array.isArray(obj)) {
    for (const item of obj) {
      const r = findValueDeep(item, keys, depth + 1);
      if (r.found) return r;
    }
    return { found: false, value: null };
  }

  const rec = obj as Record<string, unknown>;

  // 1. Cek top-level dengan key persis
  for (const k of keys) {
    if (k in rec && hasValue(rec[k])) {
      return { found: true, value: rec[k] };
    }
  }

  // 2. Cek top-level dengan key lowercase (case-insensitive)
  const lowerKeys = keys.map((k) => k.toLowerCase());
  for (const [k, v] of Object.entries(rec)) {
    if (lowerKeys.includes(k.toLowerCase()) && hasValue(v)) {
      return { found: true, value: v };
    }
  }

  // 3. Rekursif ke nested object
  for (const v of Object.values(rec)) {
    if (v && typeof v === 'object') {
      const r = findValueDeep(v, keys, depth + 1);
      if (r.found) return r;
    }
  }

  return { found: false, value: null };
};

/* ---------- Repository ---------- */

export const dashboardUserRepository = {
  async getLamaranSaya(): Promise<LamaranSummary[]> {
    const raw = await dashboardUserService.fetchLamaranSaya();
    return raw
      .map(toLamaranSummary)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime(),
      );
  },

  async applyLowongan(lowonganId: number) {
    return dashboardUserService.applyLowongan(lowonganId);
  },

  /* ---------- Stats ---------- */
  computeStats(list: LamaranSummary[]): DashboardStats {
    const by = (s: LamaranStatus) =>
      list.filter((l) => l.status === s).length;
    return {
      total: list.length,
      pending: by('pending'),
      review: by('review'),
      interview: by('interview'),
      accepted: by('accepted'),
      rejected: by('rejected'),
    };
  },

  /* ---------- Pipeline ---------- */
  computeStatusBars(list: LamaranSummary[]): StatusBar[] {
    const total = list.length || 1;
    return STATUS_ORDER.map((status) => {
      const count = list.filter((l) => l.status === status).length;
      return {
        status,
        label: STATUS_LABEL[status],
        count,
        value: Math.round((count / total) * 100),
      };
    });
  },

/* ---------- Activity Jan - Des (tahun berjalan) ---------- */
computeActivity(list: LamaranSummary[]): ActivityPoint[] {
  const currentYear = new Date().getFullYear();

  return MONTH_LABELS.map((label, monthIdx) => {
    const value = list.filter((l) => {
      const d = new Date(l.created_at);
      if (Number.isNaN(d.getTime())) return false;
      return (
        d.getFullYear() === currentYear &&
        d.getMonth() === monthIdx
      );
    }).length;

    return { label, value };
  });
},

  /* ---------- Profile completion (deep search) ---------- */
  computeProfileCompletion(profile: unknown): ProfileCompletion {
    const total = PROFILE_FIELDS.length;
    let filled = 0;
    const missing: string[] = [];
    const found: Record<string, unknown> = {};

    for (const group of PROFILE_FIELDS) {
      const r = findValueDeep(profile, group.keys);
      if (r.found) {
        filled += 1;
        found[group.label] = r.value;
      } else {
        missing.push(group.label);
      }
    }

    // Log untuk debug — buka console browser
    // eslint-disable-next-line no-console
    console.log('[PROFILE COMPLETION]', {
      filled,
      total,
      percentage: Math.round((filled / total) * 100),
      missing,
      found,
      rawData: profile,
    });

    const percentage = Math.round((filled / total) * 100);

    let hint = 'Yuk lengkapi profilmu untuk peluang lebih besar';
    if (percentage >= 100) {
      hint = 'Profil kamu sudah 100% lengkap. Keren!';
    } else if (percentage >= 80) {
      hint = `Tinggal ${missing.length} data lagi untuk sempurna`;
    } else if (percentage >= 60) {
      hint = 'Terus lengkapi profilmu, dikit lagi';
    } else if (percentage >= 40) {
      hint = 'Tambah informasi profilmu biar makin dilirik';
    }

    return { percentage, filled, total, hint, missing };
  },
};