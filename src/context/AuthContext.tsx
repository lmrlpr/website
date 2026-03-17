import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User, AuthSession } from '../types/user'
import { supabase } from '../services/supabase'

interface AuthState {
  user: User | null
  session: AuthSession | null
  loading: boolean
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, session: null, loading: true })

  useEffect(() => {
    // Will be a no-op until Supabase is configured
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      if (data.session) {
        setState({
          user: { id: data.session.user.id, email: data.session.user.email ?? '' },
          session: { user: { id: data.session.user.id, email: data.session.user.email ?? '' }, accessToken: data.session.access_token, expiresAt: data.session.expires_at ?? 0 },
          loading: false,
        })
      } else {
        setState(s => ({ ...s, loading: false }))
      }
    }).catch(() => {
      if (mounted) setState(s => ({ ...s, loading: false }))
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      if (session) {
        setState({ user: { id: session.user.id, email: session.user.email ?? '' }, session: { user: { id: session.user.id, email: session.user.email ?? '' }, accessToken: session.access_token, expiresAt: session.expires_at ?? 0 }, loading: false })
      } else {
        setState({ user: null, session: null, loading: false })
      }
    })

    return () => { mounted = false; subscription.unsubscribe() }
  }, [])

  const value: AuthContextValue = {
    ...state,
    signIn: async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    },
    signOut: async () => {
      await supabase.auth.signOut()
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
