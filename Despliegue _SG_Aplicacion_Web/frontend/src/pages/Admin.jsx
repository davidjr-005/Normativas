import { useEffect, useState } from 'react'

const TABS = ['📊 Resumen', '👥 Usuarios', '📅 Citas', '🐾 Adopciones', '🛒 Productos']

export default function Admin() {
  const [tab, setTab] = useState(0)
  const [users, setUsers] = useState([])
  const [appointments, setAppointments] = useState([])
  const [adoptions, setAdoptions] = useState([])
  const [products, setProducts] = useState([])
  const token = localStorage.getItem('token')

  const get = (url) => fetch(url, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json())

  useEffect(() => {
    get('http://localhost:3000/api/auth/users').then(d => setUsers(Array.isArray(d) ? d : [])).catch(() => {})
    get('http://localhost:3000/api/appointments').then(d => setAppointments(Array.isArray(d) ? d : [])).catch(() => {})
    get('http://localhost:3000/api/adoptions').then(d => setAdoptions(Array.isArray(d) ? d : [])).catch(() => {})
    get('http://localhost:3000/api/shop').then(d => setProducts(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  const statusColor = {
    pendiente:  { bg: '#fff8e1', color: '#f57f17' },
    confirmada: { bg: '#e8f5e9', color: '#2e7d32' },
    cancelada:  { bg: '#ffebee', color: '#c62828' },
    completada: { bg: '#e3f2fd', color: '#1565c0' },
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ color: '#2e7d32', marginBottom: '0.25rem' }}>⚙️ Panel de Administración</h1>
      <p style={{ color: '#6b8f71', marginBottom: '1.5rem' }}>Vista general del sistema</p>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {TABS.map((t, i) => (
          <button key={i} onClick={() => setTab(i)} style={{
            padding: '0.5rem 1.1rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
            background: tab === i ? '#2e7d32' : 'white',
            color: tab === i ? 'white' : '#4a7c59',
            border: tab === i ? '2px solid #2e7d32' : '2px solid #c8e6c9'
          }}>{t}</button>
        ))}
      </div>

      {/* RESUMEN */}
      {tab === 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'Usuarios', value: users.length, emoji: '👥' },
            { label: 'Citas', value: appointments.length, emoji: '📅' },
            { label: 'Adopciones', value: adoptions.length, emoji: '🐾' },
            { label: 'Productos', value: products.length, emoji: '🛒' },
            { label: 'Citas pendientes', value: appointments.filter(a => !a.status || a.status === 'pendiente').length, emoji: '⏳' },
          ].map((stat, i) => (
            <div key={i} style={{ background: 'white', border: '1px solid #c8e6c9', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem' }}>{stat.emoji}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2e7d32' }}>{stat.value}</div>
              <div style={{ color: '#6b8f71', fontSize: '0.875rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* USUARIOS */}
      {tab === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {users.length === 0 ? <p style={{ color: '#999' }}>No hay usuarios.</p> : users.map(u => (
            <div key={u.id} style={{ background: 'white', border: '1px solid #c8e6c9', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: 700, color: '#1b3a2b' }}>{u.full_name || u.email}</span>
                <span style={{ fontSize: '0.8rem', color: '#999', marginLeft: '0.5rem' }}>{u.email}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {u.is_adoptant && <span style={{ fontSize: '0.75rem', background: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 600 }}>🐾 Adoptante</span>}
                <span style={{ fontSize: '0.75rem', background: '#f3f4f6', color: '#555', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 600 }}>{u.role}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CITAS */}
      {tab === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {appointments.length === 0 ? <p style={{ color: '#999' }}>No hay citas.</p> : appointments.map(a => {
            const s = statusColor[a.status] || statusColor['pendiente']
            const fecha = a.date ? new Date(a.date).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' }) : '—'
            return (
              <div key={a.id} style={{ background: 'white', border: '1px solid #c8e6c9', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: 700, color: '#1b3a2b' }}>🐾 {a.pet_name}</span>
                  <span style={{ fontSize: '0.8rem', color: '#6b8f71', marginLeft: '0.5rem' }}>{a.notes}</span>
                  <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.2rem' }}>📆 {fecha}</div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '999px', background: s.bg, color: s.color }}>
                  {a.status || 'pendiente'}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* ADOPCIONES */}
      {tab === 3 && (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
    {adoptions.length === 0 ? <p style={{ color: '#999' }}>No hay adopciones.</p> : adoptions.map(a => (
      <div key={a.id} style={{ background: 'white', border: '1px solid #c8e6c9', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontWeight: 700, color: '#1b3a2b' }}>🐾 Mascota: {a.pet_id}</span>
          <div style={{ fontSize: '0.8rem', color: '#6b8f71' }}>Usuario: {a.user_id}</div>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#999', textAlign: 'right' }}>
          {a.adopted_at ? new Date(a.adopted_at).toLocaleDateString('es-ES') : '—'}
        </div>
      </div>
    ))}
  </div>
)}

      {/* PRODUCTOS */}
      {tab === 4 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {products.length === 0 ? <p style={{ color: '#999' }}>No hay productos.</p> : products.map(p => (
            <div key={p.id} style={{ background: 'white', border: '1px solid #c8e6c9', borderRadius: '10px', padding: '1rem' }}>
              <span style={{ fontSize: '0.7rem', color: '#4a7c59', fontWeight: 700, textTransform: 'uppercase' }}>{p.category}</span>
              <h3 style={{ margin: '0.4rem 0 0.25rem', color: '#1b3a2b', fontSize: '0.95rem' }}>{p.name}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <strong style={{ color: '#2e7d32' }}>{Number(p.price).toFixed(2)}€</strong>
                <span style={{ fontSize: '0.8rem', color: '#999' }}>Stock: {p.stock}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}