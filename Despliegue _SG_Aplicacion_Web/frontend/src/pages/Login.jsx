import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Login normal
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    const json = await res.json()

    if (!res.ok) {
      setError(json.error || 'Error al iniciar sesión')
      setLoading(false)
      return
    }

    localStorage.setItem('token', json.token)
    localStorage.setItem('user_id', json.user.id)

    const profileRes = await fetch('http://localhost:3000/api/auth/profile', {
      headers: { 'Authorization': `Bearer ${json.token}` }
    })
    const profile = await profileRes.json()
    localStorage.setItem('role', profile.role)
    localStorage.setItem('full_name', profile.full_name || '')

    navigate('/')
    window.location.reload()
  }

  // Login con GitHub
  const handleGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: 'http://localhost:5173/auth/callback'
      }
    })
    if (error) setError(error.message)
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem', textAlign: 'center' }}>🐶</div>
        <h1 style={styles.title}>VetClinic</h1>
        <p style={styles.sub}>Inicia sesión para continuar</p>

        {error && <p style={styles.errorBox}>❌ {error}</p>}

        {/* Botón GitHub */}
        <button onClick={handleGitHub} style={styles.githubBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white" style={{ marginRight: '0.5rem', flexShrink: 0 }}>
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          Continuar con GitHub
        </button>

        <div style={styles.divider}>
          <span style={styles.dividerText}>o con email</span>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label style={labelStyle}>Email</label>
            <input required type="email" placeholder="tu@email.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Contraseña</label>
            <input required type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              style={inputStyle} />
          </div>
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}

const inputStyle = { width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #c8e6c9', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }
const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4a7c59', marginBottom: '0.3rem' }
const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4faf5' },
  card: { background: 'white', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '380px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  title: { color: '#1b3a2b', margin: '0 0 0.25rem', fontSize: '1.5rem', textAlign: 'center' },
  sub: { color: '#6b8f71', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  btn: { marginTop: '0.5rem', padding: '0.75rem', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' },
  errorBox: { background: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '0.75rem' },
  githubBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '0.75rem', background: '#24292e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', marginBottom: '0.75rem' },
  divider: { display: 'flex', alignItems: 'center', margin: '0.75rem 0', gap: '0.5rem' },
  dividerText: { color: '#a0aec0', fontSize: '0.8rem', whiteSpace: 'nowrap', padding: '0 0.5rem', background: 'white' }
}