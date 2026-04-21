import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import Shop from './pages/Shop'
import Adoptions from './pages/Adoptions'
import Appointments from './pages/Appointments'
import Admin from './pages/Admin'
import Home from './pages/Home'
import Login from './pages/Login'
import AuthCallback from './pages/AuthCallback'
import './App.css'

function App() {
  const location = useLocation()
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  const fullName = localStorage.getItem('full_name')

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = '/login'
  }

  // Sin token — solo login y callback de OAuth
  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  const navLinks = [
    { to: '/',             label: '🏠 Inicio' },
    { to: '/shop',         label: '🛒 Tienda' },
    { to: '/adoptions',    label: '🐾 Adopciones' },
    { to: '/appointments', label: '📅 Citas' },
    ...(role === 'admin' ? [{ to: '/admin', label: '⚙️ Admin' }] : [])
  ]

  return (
    <div className="app-wrapper">
      <header className="navbar">
        <div className="navbar-brand">
          <span className="brand-icon">🐶</span>
          <span className="brand-name">VetClinic</span>
        </div>
        <nav className="navbar-links">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: '#f0f7f0', border: '1px solid #c8e6c9',
            borderRadius: '999px', padding: '0.35rem 0.75rem 0.35rem 0.5rem'
          }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: '#2e7d32', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 700
            }}>
              {(fullName || role || '?')[0].toUpperCase()}
            </div>
            <span style={{ fontSize: '0.85rem', color: '#1b3a2b', fontWeight: 600 }}>
              {fullName || role}
            </span>
            <span style={{
              fontSize: '0.7rem', color: '#4a7c59', background: '#c8e6c9',
              padding: '0.1rem 0.5rem', borderRadius: '999px', fontWeight: 700,
              textTransform: 'uppercase'
            }}>
              {role}
            </span>
          </div>
          <button onClick={handleLogout} style={{
            padding: '0.4rem 0.85rem', background: 'white',
            border: '1px solid #ef9a9a', borderRadius: '999px',
            color: '#c62828', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer'
          }}>
            Salir
          </button>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/adoptions" element={<Adoptions />} />
          <Route path="/appointments" element={<Appointments />} />
          {role === 'admin' && <Route path="/admin" element={<Admin />} />}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>© 2026 VetClinic · Cuidamos a tus mascotas con amor 🐾</p>
      </footer>
    </div>
  )
}

export default App