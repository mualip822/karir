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

    // ===================
    // AUTH INITIALIZED
    // ===================
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => {
      return !!state.token
    },
  },

  actions: {

    // =========================
    // LOGIN EMAIL
    // =========================
    async login(payload: LoginPayload) {

      try {
        this.loading = true
        this.error = ''

        const res = await loginService(payload)

        if (res.user && res.token) {

          this.user = res.user
          this.token = res.token

          localStorage.setItem('token', res.token)
          localStorage.setItem(
            'user',
            JSON.stringify(res.user)
          )

          if (payload.remember) {
            localStorage.setItem('remember', 'true')
          } else {
            localStorage.removeItem('remember')
          }

          await router.replace('/user/dashboard')
        }

      } catch (err: any) {

        this.error =
          err?.message ||
          'Login gagal'

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

        const res =
          await googleLoginService(googleToken)

        if (res.user && res.token) {

          this.user = res.user
          this.token = res.token

          localStorage.setItem(
            'token',
            res.token
          )

          localStorage.setItem(
            'user',
            JSON.stringify(res.user)
          )

          await router.replace('/user/dashboard')
        }

      } catch (err: any) {

        this.error =
          err?.message ||
          'Google login gagal'

      } finally {

        this.loading = false
      }
    },

    // =========================
    // INIT AUTH
    // DIPANGGIL SAAT APP START
    // =========================
    initAuth() {

      try {

        const token =
          localStorage.getItem('token')

        const user =
          localStorage.getItem('user')

        // =========================
        // RESTORE TOKEN
        // =========================
        if (token) {
          this.token = token
        } else {
          this.token = null
        }

        // =========================
        // RESTORE USER
        // =========================
        if (user) {

          try {

            this.user =
              JSON.parse(user) as User

          } catch (error) {

            console.error(
              'USER LOCAL STORAGE INVALID:',
              error
            )

            this.user = null

            localStorage.removeItem('user')
          }

        } else {

          this.user = null
        }

      } finally {

        // PENTING
        this.initialized = true
      }
    },

    // =========================
    // CLEAR AUTH
    // =========================
    clearAuth() {

      this.user = null
      this.token = null

      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('remember')
    },

    // =========================
    // LOGOUT
    // =========================
    logout() {

      this.clearAuth()

      router.replace('/login')
    },
  },
})