import { Component, type ReactNode } from 'react'

interface State {
  err: Error | null
}

/** Catches render errors in the cinematic experience and shows them on-screen
 *  instead of white-screening. Stripped on next iteration once stable. */
export class ExperienceErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { err: null }

  static getDerivedStateFromError(err: Error): State {
    return { err }
  }

  componentDidCatch(err: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('[Gotham experience] render error:', err, info.componentStack)
  }

  render() {
    if (this.state.err) {
      return (
        <div style={{
          position: 'fixed', inset: 0, padding: '2rem',
          background: '#150818', color: '#ffd0e0',
          fontFamily: 'monospace', fontSize: 13, overflow: 'auto', zIndex: 9999,
        }}>
          <h2 style={{ color: '#ff6090' }}>Gotham experience crashed</h2>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{this.state.err.stack || this.state.err.message}</pre>
        </div>
      )
    }
    return this.props.children
  }
}
