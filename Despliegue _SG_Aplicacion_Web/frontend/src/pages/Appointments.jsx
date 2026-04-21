import { useEffect, useState } from 'react'

const MOTIVOS = ['Consulta general', 'Vacunación', 'Revisión', 'Urgencia', 'Desparasitación', 'Otro']

export default function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ pet_name: '', date: '', time: '', notes: '' })

  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  const isVetOrAdmin = role === 'veterinario' || role === 'admin'

  useEffect(() => {
    fetch('http://localhost:3000/api/appointments', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => { setAppointments(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError('')

    const res = await fetch('http://localhost:3000/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ pet_name: form.pet_name, date: `${form.date}T${form.time}`, notes: form.notes })
    })

    const json = await res.json()
    if (!res.ok) { setError(json.error || 'Error al crear la cita'); setSending(false); return }

    setAppointments(prev => [json, ...prev])
    setForm({ pet_name: '', date: '', time: '', notes: '' })
    setShowForm(false)
    setSuccess(true)
    setSending(false)
    setTimeout(() => setSuccess(false), 4000)
  }

  const handleStatus = async (id, status) => {
    const res = await fetch(`http://localhost:3000/api/appointments/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status })
    })
    const json = await res.json()
    if (res.ok) {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: json.status } : a))
    }
  }

  const statusColor = {
    pendiente:  { bg: '#fff8e1', color: '#f57f17' },
    confirmada: { bg: '#e8f5e9', color: '#2e7d32' },
    cancelada:  { bg: '#ffebee', color: '#c62828' },
    completada: { bg: '#e3f2fd', color: '#1565c0' },
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ color: '#2e7d32', margin: 0 }}>📅 Citas Veterinarias</h1>
          <p style={{ color: '#6b8f71', margin: '0.25rem 0 0' }}>
            {isVetOrAdmin ? 'Gestiona todas las citas' : 'Gestiona las citas de tus mascotas'}
          </p>
        </div>
        {!isVetOrAdmin && (
          <button onClick={() => setShowForm(true)} style={btnStyle}>+ Nueva cita</button>
        )}
      </div>

      {success && (
        <div style={successBox}>✅ Cita solicitada correctamente. Te confirmaremos pronto.</div>
      )}

      {loading ? (
        <p style={{ color: '#999' }}>Cargando citas...</p>
      ) : appointments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#6b8f71' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📋</div>
          <p>No hay citas registradas todavía.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {appointments.map(a => {
            const s = statusColor[a.status] || statusColor['pendiente']
            const fecha = a.date ? new Date(a.date).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' }) : '—'
            return (
              <div key={a.id} style={{
                background: 'white', border: '1px solid #c8e6c9', borderRadius: '12px',
                padding: '1.1rem 1.25rem', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center', gap: '1rem'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ fontWeight: 700, color: '#1b3a2b' }}>🐾 {a.pet_name}</span>
                  <span style={{ fontSize: '0.875rem', color: '#4a7c59' }}>{a.notes}</span>
                  <span style={{ fontSize: '0.8rem', color: '#999' }}>📆 {fecha}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '999px', background: s.bg, color: s.color }}>
                    {a.status || 'pendiente'}
                  </span>

                  {/* Botones solo para vet/admin en citas pendientes */}
                  {isVetOrAdmin && (a.status === 'pendiente' || !a.status) && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleStatus(a.id, 'confirmada')}
                        style={{ padding: '0.35rem 0.75rem', background: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                        ✅ Aceptar
                      </button>
                      <button
                        onClick={() => handleStatus(a.id, 'cancelada')}
                        style={{ padding: '0.35rem 0.75rem', background: '#ffebee', color: '#c62828', border: '1px solid #ef9a9a', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                        ❌ Rechazar
                      </button>
                    </div>
                  )}

                  {/* Marcar como completada si está confirmada */}
                  {isVetOrAdmin && a.status === 'confirmada' && (
                    <button
                      onClick={() => handleStatus(a.id, 'completada')}
                      style={{ padding: '0.35rem 0.75rem', background: '#e3f2fd', color: '#1565c0', border: '1px solid #90caf9', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                      ☑️ Completada
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* MODAL NUEVA CITA */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '440px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
            <h2 style={{ color: '#2e7d32', marginBottom: '1.25rem' }}>Nueva cita</h2>

            {error && <p style={errorBox}>❌ {error}</p>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Nombre de la mascota *</label>
                <input required value={form.pet_name} onChange={e => setForm({ ...form, pet_name: e.target.value })} placeholder="Ej: Toby" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Motivo *</label>
                <select required value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={inputStyle}>
                  <option value="">Selecciona un motivo</option>
                  {MOTIVOS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Fecha *</label>
                  <input required type="date" value={form.date} min={new Date().toISOString().split('T')[0]} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Hora *</label>
                  <input required type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => { setShowForm(false); setError('') }} style={{ flex: 1, padding: '0.65rem', border: '1px solid #c8e6c9', borderRadius: '8px', background: 'white', color: '#4a7c59', fontWeight: 600, cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" disabled={sending} style={{ flex: 1, padding: '0.65rem', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: sending ? 'not-allowed' : 'pointer', opacity: sending ? 0.7 : 1 }}>
                  {sending ? 'Enviando...' : 'Solicitar cita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const inputStyle = { width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #c8e6c9', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }
const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4a7c59', marginBottom: '0.3rem' }
const btnStyle = { padding: '0.65rem 1.25rem', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }
const successBox = { background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', color: '#2e7d32', fontWeight: 600 }
const errorBox = { color: '#c62828', background: '#ffebee', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1rem' }