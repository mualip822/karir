export interface PersonalData {
  fullName: string
  email: string
  phone: string
  nik: string
  birthPlace: string
  birthDate: string
  gender: 'Laki-laki' | 'Perempuan'
  maritalStatus: 'Menikah' | 'Belum Menikah' | 'Cerai'
  religion: string
  address: string
  province: string
  city: string
  postalCode: string
}

export interface Education {
  level: string
  institution: string
  major: string
  graduationYear: string
  gpa: string
  certification?: string
  skills?: string
}

export interface WorkExperience {
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
  reasonForLeaving?: string
}

export interface ApplicationForm {
  jobId: number
  personal: PersonalData
  educations: Education[]
  experiences: WorkExperience[]
  cvFile: File | null
  photoFile: File | null
  certificates: File[]
  portfolio: File[]
  motivation: string
  salaryExpectation: string
  willingToRelocate: boolean
  availableFrom: string
  linkedin?: string
  github?: string
  portfolioUrl?: string
}