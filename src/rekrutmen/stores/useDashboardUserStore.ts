import { defineStore } from 'pinia'
import { ref } from 'vue'
import { dashboardUserRepository } from '../repositories/dashboardUserRepository'
import type {
  DashboardStats,
  StatusBar,
  Lowongan,
  Lamaran
} from '../types/dashboardUser.types'

export const useDashboardUserStore = defineStore('dashboardUser', () => {
  // State
  const stats = ref<DashboardStats>({
    total: 0,
    screening: 0,
    interview: 0,
    hiring: 0
  })

  const statusBars = ref<StatusBar[]>([])
  const recentLowongan = ref<Lowongan[]>([])
  const lamaranList = ref<Lamaran[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Actions
  const loadData = (): void => {
    loading.value = true
    error.value = null
    try {
      stats.value = dashboardUserRepository.getStats()
      statusBars.value = dashboardUserRepository.getStatusBars()
      recentLowongan.value = dashboardUserRepository.getRecentLowongan()
      lamaranList.value = dashboardUserRepository.getLamaran()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Gagal memuat data'
      console.error('Error loading dashboard data:', err)
    } finally {
      loading.value = false
    }
  }

  const apply = (lowonganId: number): Lamaran => {
    error.value = null
    try {
      const result = dashboardUserRepository.applyLowongan(lowonganId)
      loadData() // Refresh data after apply
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Gagal melamar'
      console.error('Error applying job:', err)
      throw err
    }
  }

  const getAllLowongan = (): Lowongan[] => {
    return dashboardUserRepository.getAllLowongan()
  }

  const getLowonganById = (id: number): Lowongan | undefined => {
    return dashboardUserRepository.getLowonganById(id)
  }

  const clearError = (): void => {
    error.value = null
  }

  return {
    // State
    stats,
    statusBars,
    recentLowongan,
    lamaranList,
    loading,
    error,
    
    // Actions
    loadData,
    apply,
    getAllLowongan,
    getLowonganById,
    clearError
  }
})