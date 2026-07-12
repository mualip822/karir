import { ref } from 'vue'
import { applicationService, type ApplicationData } from '../services/application.service'

export function useApplication() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  async function submitApplication(jobId: number, form: Omit<ApplicationData, 'cv'>, cvFile: File) {
    loading.value = true
    error.value = null
    try {
      const result = await applicationService.submitApplication(jobId, form, cvFile)
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Terjadi kesalahan'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  return { submitApplication, loading, error }
}