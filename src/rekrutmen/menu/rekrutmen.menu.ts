export const rekrutmenUserMenu = [

  // =========================
  // DASHBOARD
  // =========================
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard",
    to: "/user/dashboard",
  },


  // =========================
  // LOWONGAN
  // =========================
  {
    title: "Lowongan",
    icon: "mdi-briefcase",
    to: "/user/lowongan",
  },


  // =========================
  // LAMARAN
  // =========================
  {
    title: "Lamaran Saya",
    icon: "mdi-file-document",
    to: "/user/lamaran",
  },


  // =========================
  // PESAN
  // =========================
  {
    title: "Pesan",
    icon: "mdi-email",
    to: "/user/pesan",
  },


  // =========================
  // PROFILE
  // =========================
  {
    title: "Profil",

    icon: "mdi-account",

    children: [

      {
        title: "Profil Saya",
        to: "/user/profile",
      },


      {
        title: "Pengaturan",
        to: "/user/pengaturan",
      },

    ],
  },

];