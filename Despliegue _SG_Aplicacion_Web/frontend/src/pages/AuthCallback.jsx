import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { navigate('/login'); return }

      const token = session.access_token
      localStorage.setItem('token', token)
      localStorage.setItem('user_id', session.user.id)

      // Obtener perfil con rol
      const res = await fetch('http://localhost:3000/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const profile = await res.json()

      if (profile?.role) {
        localStorage.setItem('role', profile.role)
        localStorage.setItem('full_name', profile.full_name || session.user.user_metadata?.user_name || '')
        navigate('/')
        window.location.reload()
      } else {
        // Primera vez con GitHub — perfil no existe aún, crear con rol cliente
        await fetch('http://localhost:3000/api/auth/register-oauth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.name || session.user.user_metadata?.user_name || ''
          })
        })
        localStorage.setItem('role', 'cliente')
        localStorage.setItem('full_name', session.user.user_metadata?.name || '')
        navigate('/')
        window.location.reload()
      }
    })
  }, [])

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f4faf5' }}>
      <p style={{ color: '#4a7c59', fontWeight: 600, fontSize: '1.1rem' }}>🐾 Iniciando sesión...</p>
    </div>
  )
}