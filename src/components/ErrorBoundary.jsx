import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: '#f8fafc',
          fontFamily: 'Noto Sans, sans-serif'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '40px',
            maxWidth: '420px',
            textAlign: 'center',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: '#fee2e2',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '28px'
            }}>⚠️</div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#1a3c6e', margin: '0 0 8px' }}>Something went wrong</h1>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 24px', lineHeight: 1.5 }}>
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <pre style={{
              fontSize: '11px',
              color: '#dc2626',
              background: '#fef2f2',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              overflow: 'auto',
              maxHeight: '120px',
              textAlign: 'left'
            }}>{this.state.error?.message}</pre>
            <button onClick={() => window.location.reload()}
              style={{
                padding: '12px 32px',
                background: '#f97316',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >Refresh Page</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
