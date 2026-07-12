export interface LoginPayload {
  email: string
  password: string
  remember?: boolean
}

export interface User {
  id: number
  name?: string
  email: string
  role: string
}

export interface AuthResponse {
  success?: boolean

  user?: User

  token?: string

  message?: string
}