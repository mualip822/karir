import { defineStore } from 'pinia'

export const useRekrutmenStore = defineStore('rekrutmen', {
  state: () => ({
    lowongan: [] as any[],
    kandidat: [] as any[],
  }),

  actions: {
    addLowongan(data: any) {
      this.lowongan.push(data)
    },

    applyLowongan(data: any) {
      this.kandidat.push({
        ...data,
        stage: 'Apply',
        created_at: new Date(),
      })
    },

    updateStage(id: number, stage: string) {
      const k = this.kandidat.find((x: any) => x.id === id)

      if (k) {
        k.stage = stage
      }
    },
  },
})