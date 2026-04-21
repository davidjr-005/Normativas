import { useEffect, useState } from 'react'

export default function Adoptions() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  const loadPets = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/adoptions/pets', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setPets(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadPets() }, [])

  const handleAdopt = async () => {
    setSending(true)
    setError('')

    const res = await fetch('http://localhost:3000/api/adoptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ pet_id: selected.id })
    })

    const json = await res.json()

    if (!res.ok) {
      setError(json.error || 'Error al procesar la adopción')
      setSending(false)
      return
    }

    // Recargar lista desde la BD
    await loadPets()
    setSelected(null)
    setSuccess(true)
    setSending(false)
    setTimeout(() => setSuccess(false), 4000)
  }

  if (loading) return <p style={{ padding: '2rem' }}>Cargando mascotas...</p>

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ color: '#2e7d32', marginBottom: '0.5rem' }}>🐾 Adopciones</h1>
      <p style={{ color: '#6b8f71', marginBottom: '1.5rem' }}>Estas mascotas están esperando un hogar</p>

      {success && (
        <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', color: '#2e7d32', fontWeight: 600 }}>
          ✅ ¡Adopción completada! Ya tienes acceso a descuentos exclusivos en la tienda.
        </div>
      )}

      {pets.length === 0 && !success && (
        <p style={{ color: '#999' }}>No hay mascotas disponibles por ahora.</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {pets.map(pet => (
          <div key={pet.id} style={{
            background: 'white', border: '1px solid #c8e6c9',
            borderRadius: '12px', padding: '1.25rem',
            display: 'flex', flexDirection: 'column', gap: '0.4rem'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#4a7c59', fontWeight: 600, textTransform: 'uppercase' }}>
              {pet.species} {pet.breed ? `· ${pet.breed}` : ''}
            </span>
            <h3 style={{ margin: 0, color: '#1b3a2b' }}>{pet.name}</h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b8f71' }}>
              {pet.age ? `${pet.age} años` : ''} {pet.gender ? `· ${pet.gender}` : ''}
            </p>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#888', flexGrow: 1 }}>
              {pet.description}
            </p>
            <button
              onClick={() => setSelected(pet)}
              style={{
                marginTop: '0.75rem', padding: '0.6rem',
                background: '#2e7d32', color: 'white',
                border: 'none', borderRadius: '8px',
                fontWeight: 600, cursor: 'pointer'
              }}>
              Quiero adoptarlo
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '2rem',
            width: '100%', maxWidth: '400px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
          }}>
            <h2 style={{ color: '#2e7d32', marginBottom: '0.5rem' }}>
              Adoptar a {selected.name}
            </h2>
            <p style={{ color: '#6b8f71', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Al confirmar, quedarás registrado como adoptante y obtendrás descuentos en la tienda.
            </p>

            {error && (
              <p style={{ color: '#c62828', background: '#ffebee', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1rem' }}>
                ❌ {error}
              </p>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => { setSelected(null); setError('') }}
                style={{
                  flex: 1, padding: '0.65rem',
                  border: '1px solid #c8e6c9', borderRadius: '8px',
                  background: 'white', color: '#4a7c59',
                  fontWeight: 600, cursor: 'pointer'
                }}>
                Cancelar
              </button>
              <button
                onClick={handleAdopt}
                disabled={sending}
                style={{
                  flex: 1, padding: '0.65rem',
                  background: '#2e7d32', color: 'white',
                  border: 'none', borderRadius: '8px',
                  fontWeight: 600, cursor: sending ? 'not-allowed' : 'pointer',
                  opacity: sending ? 0.7 : 1
                }}>
                {sending ? 'Procesando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}