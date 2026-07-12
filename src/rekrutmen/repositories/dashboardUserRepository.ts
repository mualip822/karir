import * as service from '../services/dashboardUserService'
import type {
  Lowongan,
  Lamaran,
  DashboardStats,
  StatusBar
} from '../types/dashboardUser.types'

export interface IDashboardUserRepository {
  getStats(): DashboardStats
  getStatusBars(): StatusBar[]
  getRecentLowongan(limit?: number): Lowongan[]
  getLamaran(): Lamaran[]
  applyLowongan(id: number): Lamaran
  getAllLowongan(): Lowongan[]
  getLowonganById(id: number): Lowongan | undefined
}

class DashboardUserRepository implements IDashboardUserRepository {
  getStats(): DashboardStats {
    return service.getDashboardStats()
  }

  getStatusBars(): StatusBar[] {
    return service.getStatusBars()
  }

  getRecentLowongan(limit: number = 3): Lowongan[] {
    return service.getRecentLowongan(limit)
  }

  getLamaran(): Lamaran[] {
    return service.getLamaranList()
  }

  applyLowongan(id: number): Lamaran {
    return service.applyLowongan(id)
  }

  getAllLowongan(): Lowongan[] {
    return service.getAllLowongan()
  }

  getLowonganById(id: number): Lowongan | undefined {
    return service.getLowonganById(id)
  }
}

export const dashboardUserRepository = new DashboardUserRepository()