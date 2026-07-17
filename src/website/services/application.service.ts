import axios from 'axios'

const API_URL =
  `${import.meta.env.VITE_API_URL}/rekrutmen/lamaran`;

export interface ApplicationData {
  name: string
  email: string
  phone: string
  message: string
}

export const applicationService = {
  async submitApplication(jobId: number, data: ApplicationData, cvFile: File) {
    const formData = new FormData()
    formData.append('jobId', jobId.toString())
    formData.append('name', data.name)
    formData.append('email', data.email)
    formData.append('phone', data.phone)
    formData.append('message', data.message)
    formData.append('cv', cvFile)
    
    const token = localStorage.getItem('candidate_token')
    const headers: Record<string, string> = {}
    if (token) headers['Authorization'] = `Bearer ${token}`
    
    const response = await axios.post(API_URL, formData, { headers })
    if (response.data.success) {
      return response.data
    } else {
      throw new Error(response.data.message || 'Gagal mengirim lamaran')
    }
  }
}