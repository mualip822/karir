import type { Lowongan, Lamaran, DashboardStats, StatusBar, ApplyPayload } from '../types/dashboardUser.types'

// Mock Data
const lowonganData: Lowongan[] = [
  {
    id: 1,
    title: 'Frontend Developer',
    lokasi: 'Jakarta',
    perusahaan: 'PT Teknologi Maju',
    gajiMin: 5000000,
    gajiMax: 10000000,
    deskripsi: 'Membuat aplikasi web dengan Vue.js',
    tanggalPosting: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Backend Developer',
    lokasi: 'Bandung',
    perusahaan: 'PT Solusi Digital',
    gajiMin: 6000000,
    gajiMax: 12000000,
    deskripsi: 'Mengembangkan API dengan Node.js',
    tanggalPosting: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    title: 'UI/UX Designer',
    lokasi: 'Surabaya',
    perusahaan: 'PT Kreatif Inovasi',
    gajiMin: 4500000,
    gajiMax: 8000000,
    deskripsi: 'Mendesain antarmuka pengguna',
    tanggalPosting: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 4,
    title: 'Fullstack Developer',
    lokasi: 'Jakarta',
    perusahaan: 'PT Eksplorasi Digital',
    gajiMin: 8000000,
    gajiMax: 15000000,
    deskripsi: 'Mengembangkan aplikasi fullstack',
    tanggalPosting: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 5,
    title: 'Data Analyst',
    lokasi: 'Yogyakarta',
    perusahaan: 'PT Data Insight',
    gajiMin: 5500000,
    gajiMax: 9000000,
    deskripsi: 'Menganalisis data perusahaan',
    tanggalPosting: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
]

// Mock Lamaran Data (disimpan di localStorage)
let lamaranData: Lamaran[] = []

const loadLamaranFromStorage = (): void => {
  const stored = localStorage.getItem('dashboard_lamaran')
  if (stored) {
    lamaranData = JSON.parse(stored)
  } else {
    // Mock initial lamaran
    lamaranData = [
      {
        id: 1,
        lowonganId: 1,
        posisi: 'Frontend Developer',
        stage: 'Interview',
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        lowonganId: 2,
        posisi: 'Backend Developer',
        stage: 'Screening',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
    saveLamaranToStorage()
  }
}

const saveLamaranToStorage = (): void => {
  localStorage.setItem('dashboard_lamaran', JSON.stringify(lamaranData))
}

loadLamaranFromStorage()

// Generate ID
const generateId = (): number => {
  return Date.now() + Math.floor(Math.random() * 1000)
}

export const getDashboardStats = (): DashboardStats => {
  const total = lamaranData.length
  const screening = lamaranData.filter(l => l.stage === 'Screening').length
  const interview = lamaranData.filter(l => l.stage === 'Interview').length
  const hiring = lamaranData.filter(l => l.stage === 'Hiring').length
  
  return { total, screening, interview, hiring }
}

export const getStatusBars = (): StatusBar[] => {
  const total = lamaranData.length || 1 // Prevent division by zero
  const apply = lamaranData.filter(l => l.stage === 'Apply').length
  const screening = lamaranData.filter(l => l.stage === 'Screening').length
  const interview = lamaranData.filter(l => l.stage === 'Interview').length
  const hiring = lamaranData.filter(l => l.stage === 'Hiring').length
  
  return [
    { label: 'Apply', value: Math.round((apply / total) * 100) },
    { label: 'Screening', value: Math.round((screening / total) * 100) },
    { label: 'Interview', value: Math.round((interview / total) * 100) },
    { label: 'Hiring', value: Math.round((hiring / total) * 100) }
  ]
}

export const getRecentLowongan = (limit: number = 3): Lowongan[] => {
  return [...lowonganData]
    .sort((a, b) => new Date(b.tanggalPosting).getTime() - new Date(a.tanggalPosting).getTime())
    .slice(0, limit)
}

export const getLamaranList = (): Lamaran[] => {
  return [...lamaranData].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export const applyLowongan = (lowonganId: number): Lamaran => {
  const lowongan = lowonganData.find(l => l.id === lowonganId)
  if (!lowongan) {
    throw new Error('Lowongan tidak ditemukan')
  }
  
  const existingLamaran = lamaranData.find(l => l.lowonganId === lowonganId)
  if (existingLamaran) {
    throw new Error('Anda sudah melamar di lowongan ini')
  }
  
  const newLamaran: Lamaran = {
    id: generateId(),
    lowonganId: lowongan.id,
    posisi: lowongan.title,
    stage: 'Apply',
    created_at: new Date().toISOString()
  }
  
  lamaranData.unshift(newLamaran)
  saveLamaranToStorage()
  
  return newLamaran
}

export const getLowonganById = (id: number): Lowongan | undefined => {
  return lowonganData.find(l => l.id === id)
}

export const getAllLowongan = (): Lowongan[] => {
  return [...lowonganData]
}