import { defineStore } from 'pinia'

import {
  loginService,
  googleLoginService,
} from '../services/authService'

import type {
  LoginPayload,
  User,
} from '../types/auth.types'

import router from '../../router'

// =========================
// AUTH STORE
// =========================
export const useAuthStore = defineStore('auth', {

  state: () => ({

    // ===================
    // USER
    // ===================
    user: null as User | null,

    token: null as string | null,

    // ===================
    // UI STATE
    // ===================
    loading: false,

    error: '',
  }),

  actions: {

    // =========================
    // LOGIN EMAIL
    // =========================
    async login(payload: LoginPayload) {

      try {

        this.loading = true
        this.error = ''

        const res = await loginService(payload)

        // SUCCESS
        if (res.user && res.token) {

          this.user = res.user
          this.token = res.token

          localStorage.setItem('token', res.token)
          localStorage.setItem('user', JSON.stringify(res.user))

          if (payload.remember) {
            localStorage.setItem('remember', 'true')
          }

          // 🔥 REDIRECT AFTER LOGIN
          await router.replace('/user/dashboard')
        }

      } catch (err: any) {

        this.error = err.message || 'Login gagal'

      } finally {

        this.loading = false
      }
    },

    // =========================
    // GOOGLE LOGIN
    // =========================
    async loginWithGoogle(googleToken: string) {

      try {

        this.loading = true
        this.error = ''

        const res = await googleLoginService(googleToken)

        // SUCCESS
        if (res.user && res.token) {

          this.user = res.user
          this.token = res.token

          localStorage.setItem('token', res.token)
          localStorage.setItem('user', JSON.stringify(res.user))

          // 🔥 REDIRECT AFTER GOOGLE LOGIN
          await router.replace('/user/dashboard')
        }

      } catch (err: any) {

        this.error = err.message || 'Google login gagal'

      } finally {

        this.loading = false
      }
    },

    // =========================
    // INIT AUTH (REFRESH PAGE)
    // =========================
    initAuth() {

      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')

      if (token) {
        this.token = token
      }

      if (user) {
        this.user = JSON.parse(user)
      }
    },

    // =========================
    // LOGOUT
    // =========================
    logout() {

      this.user = null
      this.token = null

      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('remember')

      router.replace('/login')
    },
  },
})