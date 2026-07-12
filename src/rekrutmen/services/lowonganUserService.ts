import { ref } from 'vue';

export interface Lowongan {
  id: number;
  title: string;
  divisi: string;
  lokasi: string;
  deskripsi: string;
  persyaratan: string[];
  tanggungJawab: string[];
  benefit: string[];
  tipePekerjaan: string;
  gajiMin: number;
  gajiMax: number;
  pengalaman: string;
  pendidikan: string;
  perusahaan: string;
  tanggalPosting: string;
}

export interface Lamaran {
  lowonganId: number;
  lowonganTitle: string;
  // Step 1
  nama: string;
  email: string;
  noHp: string;
  tglLahir: string;
  jenisKelamin: string;
  alamat: string;
  // Step 2
  pendidikanTerakhir: string;
  institusi: string;
  tahunLulus: string;
  pengalamanKerja: { perusahaan: string; posisi: string; tahun: string; deskripsi: string }[];
  // Step 3
  cvFile?: File | null;
  portofolioUrl?: string;
  // Step 4
  motivasi: string;
  harapanGaji: number;
}

// Data lowongan (sama seperti admin)
const lowonganList = ref<Lowongan[]>([
  {
    id: 1,
    title: "Frontend Developer (Vue.js)",
    divisi: "IT",
    lokasi: "Bogor (Hybrid)",
    deskripsi: "Bergabunglah dengan tim produk kami untuk mengembangkan aplikasi web yang responsif dan user-friendly. Anda akan bertanggung jawab membangun komponen UI yang reusable, mengintegrasikan API, serta memastikan performa aplikasi optimal. Kami mencari pribadi yang antusias dengan ekosistem Vue 3 dan ingin berkembang di lingkungan startup teknologi.",
    persyaratan: [
      "Pengalaman minimal 2 tahun dengan Vue.js (Vue 3, Composition API)",
      "Menguasai HTML5, CSS3, Tailwind / Bootstrap",
      "Memahami state management (Pinia/Vuex)",
      "Bisa mengintegrasikan REST API",
      "Mampu bekerja dalam tim dengan Git Flow"
    ],
    tanggungJawab: [
      "Membangun komponen frontend reusable",
      "Optimasi performa aplikasi (lazy loading, code splitting)",
      "Berkolaborasi dengan backend developer",
      "Menulis unit test (Jest/Vitest)",
      "Ikut serta dalam daily scrum dan code review"
    ],
    benefit: [
      "Gaji kompetitif + THR + bonus tahunan",
      "Asuransi kesehatan (BPJS + private)",
      "Laptop MacBook / PC high-end",
      "Kursus/konferensi gratis (budget tahunan)",
      "Jam kerja fleksibel & WFH 2x/minggu"
    ],
    tipePekerjaan: "Full-time",
    gajiMin: 6000000,
    gajiMax: 10000000,
    pengalaman: "Minimal 2 tahun",
    pendidikan: "D3/S1 Teknik Informatika / Sistem Informasi atau setara",
    perusahaan: "PT Teknologi Kreasi Nusantara",
    tanggalPosting: "25 Maret 2025"
  },
  {
    id: 2,
    title: "Backend Developer (Node.js)",
    divisi: "IT",
    lokasi: "Jakarta Pusat",
    deskripsi: "Kami mencari backend engineer yang handal untuk mengembangkan API dan layanan mikro yang scalable. Anda akan bekerja dengan database SQL/NoSQL, mengoptimalkan query, dan memastikan keamanan sistem.",
    persyaratan: [
      "Minimal 3 tahun dengan Node.js (Express/Nest.js)",
      "Menguasai PostgreSQL, MongoDB, atau Redis",
      "Paham konsep RESTful, GraphQL (bonus)",
      "Pernah menggunakan Docker & CI/CD"
    ],
    tanggungJawab: [
      "Merancang dan mengembangkan REST API",
      "Mengelola database dan performa query",
      "Membuat dokumentasi API (Swagger)",
      "Menjaga keamanan server"
    ],
    benefit: [
      "Gaji hingga 15 juta",
      "BPJS Kesehatan & Ketenagakerjaan",
      "Bonus project",
      "Lembur dibayar"
    ],
    tipePekerjaan: "Full-time",
    gajiMin: 9000000,
    gajiMax: 15000000,
    pengalaman: "Minimal 3 tahun",
    pendidikan: "S1 Ilmu Komputer / sederajat",
    perusahaan: "PT Solusi Digital Indonesia",
    tanggalPosting: "24 Maret 2025"
  },
  {
    id: 3,
    title: "Finance & Admin Staff",
    divisi: "Finance",
    lokasi: "Depok",
    deskripsi: "Mengelola laporan keuangan harian, arus kas, dan administrasi umum. Kami butuh kandidat yang teliti, jujur, dan familiar dengan software akuntansi.",
    persyaratan: [
      "Lulusan D3/S1 Akuntansi/Manajemen",
      "Memahami pencatatan jurnal & laporan laba rugi",
      "Bisa menggunakan Excel (pivot, vlookup)",
      "Pengalaman minimal 1 tahun"
    ],
    tanggungJawab: [
      "Merekam transaksi keuangan",
      "Membuat laporan bulanan",
      "Mengelola invoice dan pembayaran vendor"
    ],
    benefit: [
      "Gaji 4-6 juta",
      "BPJS",
      "Tunjangan makan & transport"
    ],
    tipePekerjaan: "Full-time",
    gajiMin: 4000000,
    gajiMax: 6000000,
    pengalaman: "Minimal 1 tahun",
    pendidikan: "D3/S1 Akuntansi/Manajemen",
    perusahaan: "PT Mitra Niaga Sejahtera",
    tanggalPosting: "22 Maret 2025"
  },
  {
    id: 4,
    title: "Human Resources Generalist",
    divisi: "SDM",
    lokasi: "Bogor",
    deskripsi: "Menangani rekrutmen, administrasi karyawan, dan pengembangan budaya perusahaan. Kami mencari HR yang proaktif dan memiliki empati tinggi.",
    persyaratan: [
      "Pengalaman 2 tahun sebagai HR Generalist",
      "Memahami UU Ketenagakerjaan",
      "Bisa melakukan wawancara & psikotes"
    ],
    tanggungJawab: [
      "Mengelola proses rekrutmen end-to-end",
      "Membuat payroll & laporan kehadiran",
      "Mengadakan training & team building"
    ],
    benefit: [
      "Gaji 6-8 juta",
      "Asuransi swasta",
      "Liburan tahunan bersama"
    ],
    tipePekerjaan: "Full-time",
    gajiMin: 6000000,
    gajiMax: 8000000,
    pengalaman: "Minimal 2 tahun",
    pendidikan: "S1 Psikologi/Manajemen SDM",
    perusahaan: "PT Karya Bangsa Group",
    tanggalPosting: "20 Maret 2025"
  },
  {
    id: 5,
    title: "UI/UX Designer",
    divisi: "Design",
    lokasi: "Remote",
    deskripsi: "Merancang antarmuka aplikasi web & mobile yang intuitif dan estetik. Kami butuh desainer yang riset user, membuat wireframe, prototype, serta melakukan usability testing.",
    persyaratan: [
      "Portofolio menunjukkan 3+ project digital",
      "Mahir Figma, Adobe XD, atau Sketch",
      "Memahami design system & atomic design"
    ],
    tanggungJawab: [
      "Membuat user flow & wireframe",
      "Mendesain high-fidelity prototype",
      "Berkolaborasi dengan developer"
    ],
    benefit: [
      "Gaji 7-12 juta",
      "Kerja 100% remote",
      "Alat desain berbayar digratiskan"
    ],
    tipePekerjaan: "Full-time",
    gajiMin: 7000000,
    gajiMax: 12000000,
    pengalaman: "Minimal 2 tahun",
    pendidikan: "D3/S1 Desain Komunikasi Visual",
    perusahaan: "Creative Space Studio",
    tanggalPosting: "23 Maret 2025"
  },
  {
    id: 6,
    title: "Guru Matematika",
    divisi: "Pendidikan",
    lokasi: "Bogor",
    deskripsi: "Mengajar matematika untuk tingkat SMP dan SMA dengan metode yang kreatif. Kami membuka kesempatan untuk fresh graduate yang punya passion mengajar.",
    persyaratan: [
      "Sarjana Pendidikan Matematika / MIPA",
      "Bisa menjelaskan konsep dengan sederhana",
      "Pernah mengajar les/bimbel"
    ],
    tanggungJawab: [
      "Menyusun RPP & materi ajar",
      "Memberikan evaluasi & remedial",
      "Membimbing olimpiade matematika"
    ],
    benefit: [
      "Gaji 4-5 juta",
      "Tunjangan sertifikasi",
      "BPJS"
    ],
    tipePekerjaan: "Full-time",
    gajiMin: 4000000,
    gajiMax: 5000000,
    pengalaman: "Fresh graduate / 1 tahun",
    pendidikan: "S1 Pendidikan Matematika",
    perusahaan: "Yayasan Pendidikan Al-Fikri",
    tanggalPosting: "21 Maret 2025"
  }
]);

export const useLowonganUserService = () => {
  const getLowongan = () => lowonganList;

  const submitLamaran = (lamaran: Lamaran) => {
    // Simulasi penyimpanan (localStorage)
    const existing = localStorage.getItem("lamaranHistoryUser");
    const history = existing ? JSON.parse(existing) : [];
    history.push({ ...lamaran, cvFileName: lamaran.cvFile?.name, submittedAt: new Date().toISOString() });
    localStorage.setItem("lamaranHistoryUser", JSON.stringify(history));
    console.log("Lamaran tersimpan:", lamaran);
    alert(`Lamaran untuk posisi "${lamaran.lowonganTitle}" berhasil dikirim! Kami akan segera memprosesnya.`);
  };

  return { getLowongan, submitLamaran };
};