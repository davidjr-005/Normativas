import { useEffect, useState } from 'react'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdoptant, setIsAdoptant] = useState(false)

  const token = localStorage.getItem('token')

  useEffect(() => {
    const loadShop = async () => {
      // 1. Comprobar si el usuario es adoptante
      const profileRes = await fetch('http://localhost:3000/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const profile = await profileRes.json()
      const adoptant = profile?.is_adoptant === true
      setIsAdoptant(adoptant)

      // 2. Llamar al endpoint correcto según rol
      const url = adoptant
        ? 'http://localhost:3000/api/shop/discounts'
        : 'http://localhost:3000/api/shop'

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setProducts(data)
      setLoading(false)
    }

    loadShop()
  }, [])

  if (loading) return <p style={{ padding: '2rem' }}>Cargando productos...</p>
  if (products.length === 0) return <p style={{ padding: '2rem' }}>No hay productos disponibles.</p>

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ color: '#2e7d32', marginBottom: '0.25rem' }}>🛒 Tienda</h1>

      {/* Banner descuento adoptante */}
      {isAdoptant && (
        <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.5rem', color: '#2e7d32', fontWeight: 600, fontSize: '0.9rem' }}>
          🐾 ¡Gracias por adoptar! Tienes un <strong>15% de descuento</strong> en todos los productos.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {products.map(p => (
          <div key={p.id} style={{
            background: 'white', border: '1px solid #c8e6c9',
            borderRadius: '12px', padding: '1.25rem',
            display: 'flex', flexDirection: 'column', gap: '0.4rem'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#4a7c59', fontWeight: 600, textTransform: 'uppercase' }}>
              {p.category}
            </span>
            <h3 style={{ margin: 0, color: '#1b3a2b', fontSize: '1rem' }}>{p.name}</h3>
            <p style={{ margin: 0, color: '#6b8f71', fontSize: '0.875rem', flexGrow: 1 }}>{p.description}</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {/* Precio con descuento */}
                {isAdoptant && p.discounted_price ? (
                  <>
                    <span style={{ color: '#999', textDecoration: 'line-through', fontSize: '0.875rem' }}>
                      {Number(p.price).toFixed(2)}€
                    </span>
                    <strong style={{ color: '#2e7d32', fontSize: '1.1rem' }}>
                      {Number(p.discounted_price).toFixed(2)}€
                    </strong>
                  </>
                ) : (
                  <strong style={{ color: '#2e7d32', fontSize: '1.1rem' }}>
                    {Number(p.price).toFixed(2)}€
                  </strong>
                )}
              </div>
              <span style={{ fontSize: '0.8rem', color: '#999' }}>Stock: {p.stock}</span>
            </div>

            <button style={{
              marginTop: '0.5rem', padding: '0.6rem',
              background: '#2e7d32', color: 'white',
              border: 'none', borderRadius: '8px',
              fontWeight: 600, cursor: 'pointer'
            }}>
              Añadir al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}