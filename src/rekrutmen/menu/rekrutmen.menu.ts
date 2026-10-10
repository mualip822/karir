/* ============================================================
   REKRUTMEN MENU
============================================================ */

export interface RekrutmenMenuItem {
  title: string;
  icon: string;
  to?: string;
  children?: RekrutmenMenuItem[];
}

/* ================================================================
   MENU DEFAULT

   Menu ini hanya fallback.
   Menu aktual user akan diambil dari:
   GET /api/settings/menu

   Catatan:
   "Pesan" dihapus dari menu — dipindah ke icon notifikasi header.
================================================================ */

export const rekrutmenUserMenu: RekrutmenMenuItem[] = [
  // ==============================================================
  // 1. DASHBOARD
  // ==============================================================
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard',
    to: '/user/dashboard',
  },

  // ==============================================================
  // 2. LOWONGAN
  // ==============================================================
  {
    title: 'Lowongan',
    icon: 'mdi-briefcase',
    to: '/user/lowongan',
  },

  // ==============================================================
  // 3. LAMARAN SAYA
  // ==============================================================
  {
    title: 'Lamaran Saya',
    icon: 'mdi-file-document',
    to: '/user/lamaran',
  },

  // ==============================================================
  // 4. PROFIL
  // ==============================================================
  {
    title: 'Profil',
    icon: 'mdi-account',
    children: [
      {
        title: 'Profil Saya',
        icon: '',
        to: '/user/profile',
      },
      {
        title: 'Pengaturan',
        icon: '',
        to: '/user/pengaturan',
      },
    ],
  },
];