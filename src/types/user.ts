export interface User {
  id: string
  email: string
  role?: 'student' | 'teacher' | 'admin'
}

export interface AuthSession {
  user: User
  accessToken: string
  expiresAt: number
}
