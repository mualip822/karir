import type {
  LoginPayload,
} from '../types/auth.types'

const BASE_URL =
  'http://localhost:3000/api'

// =========================
// LOGIN
// =========================
export const loginApi =
  async (
    payload: LoginPayload
  ) => {

    const res =
      await fetch(
        `${BASE_URL}/auth/login`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body:
            JSON.stringify(
              payload
            ),
        }
      )

    const data =
      await res.json()

    if (!res.ok) {

      throw new Error(
        data.message ||
        'Login gagal'
      )
    }

    return data
  }

// =========================
// LOGIN GOOGLE
// =========================
export const googleLoginApi =
  async (
    token: string
  ) => {

    const res =
      await fetch(
        `${BASE_URL}/auth/google`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body:
            JSON.stringify({
              token,
            }),
        }
      )

    const data =
      await res.json()

    if (!res.ok) {

      throw new Error(
        data.message ||
        'Google login gagal'
      )

    }

    return data
  }