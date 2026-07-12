import {
  loginApi,
  googleLoginApi,
} from '../repositories/authRepository'

import type {
  LoginPayload,
  AuthResponse,
} from '../types/auth.types'

// =========================
// LOGIN
// =========================
export const loginService =
  async (
    payload: LoginPayload
  ): Promise<AuthResponse> => {

    return await loginApi(
      payload
    )
  }

// =========================
// LOGIN GOOGLE
// =========================
export const googleLoginService =
  async (
    token: string
  ): Promise<AuthResponse> => {

    return await googleLoginApi(
      token
    )
  }