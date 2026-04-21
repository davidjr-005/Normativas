import { Link } from 'react-router-dom'
import '../App.css'

function Home() {
  return (
    <div className="home">

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">🐾 Clínica Veterinaria de Confianza</span>
          <h1>El mejor cuidado<br />para tu mascota</h1>
          <p>Somos tu clínica veterinaria de referencia en Jerez. Productos, adopciones, citas y mucho más.</p>
          <div className="hero-buttons">
            <Link to="/appointments" className="btn-hero-primary">📅 Pedir Cita</Link>
            <Link to="/shop" className="btn-hero-secondary">🛒 Ver Tienda</Link>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80"
            alt="Perro feliz en la clínica veterinaria"
            width="600"
            height="450"
            loading="eager"
          />
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="stat-item">
          <span className="stat-number">+2.000</span>
          <span className="stat-label">Mascotas atendidas</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">15</span>
          <span className="stat-label">Años de experiencia</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">+500</span>
          <span className="stat-label">Productos en tienda</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">98%</span>
          <span className="stat-label">Clientes satisfechos</span>
        </div>
      </section>

      {/* SECCIONES PRINCIPALES */}
      <section className="sections-grid">
        <h2 className="section-title">¿Qué podemos hacer por ti?</h2>
        <div className="cards-row">

          <div className="section-card shop-card">
            <div className="card-icon">🛒</div>
            <h3>Tienda</h3>
            <p>Piensos, juguetes, accesorios y medicamentos para tu mascota. Todo lo que necesitas en un solo lugar.</p>
            <Link to="/shop" className="card-link">Ver productos →</Link>
          </div>

          <div className="section-card adoptions-card">
            <div className="card-icon">🐾</div>
            <h3>Adopciones</h3>
            <p>Dale un hogar a un animal que lo necesita. Tenemos perros, gatos y pequeños animales esperando familia.</p>
            <Link to="/adoptions" className="card-link">Ver adopciones →</Link>
          </div>

          <div className="section-card appointments-card">
            <div className="card-icon">📅</div>
            <h3>Citas</h3>
            <p>Consultas, vacunas, revisiones y urgencias. Pide tu cita online de forma rápida y sencilla.</p>
            <Link to="/appointments" className="card-link">Pedir cita →</Link>
          </div>

        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="featured-products">
        <h2 className="section-title">Productos Destacados</h2>
        <div className="products-grid">
          {[
            { name: 'Pienso Premium Adulto', price: '24,99€', img: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=300&q=80', tag: 'Más vendido' },
            { name: 'Juguete Interactivo', price: '12,50€', img: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=300&q=80', tag: 'Nuevo' },
            { name: 'Cama Ortopédica', price: '49,99€', img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&q=80', tag: 'Oferta' },
            { name: 'Transportín Seguro', price: '34,95€', img: 'https://images.unsplash.com/photo-1548767797-d8c844163c4a?w=300&q=80', tag: '' },
          ].map((p, i) => (
            <div className="product-card" key={i}>
              {p.tag && <span className="product-tag">{p.tag}</span>}
              <img src={p.img} alt={p.name} width="300" height="200" loading="lazy" />
              <div className="product-info">
                <h4>{p.name}</h4>
                <div className="product-footer">
                  <span className="product-price">{p.price}</span>
                  <button className="btn-add">+ Añadir</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="center">
          <Link to="/shop" className="btn-ver-mas">Ver toda la tienda →</Link>
        </div>
      </section>

      {/* BANNER ADOPCIONES */}
      <section className="adoption-banner">
        <div className="adoption-text">
          <h2>🐶 Adopta, no compres</h2>
          <p>Miles de animales buscan un hogar. Conoce a los peludos que tenemos disponibles y cambia una vida para siempre.</p>
          <Link to="/adoptions" className="btn-adoption">Ver animales en adopción</Link>
        </div>
        <div className="adoption-image">
          <img
            src="https://images.unsplash.com/photo-1601758174493-45d0a4d3e407?w=500&q=80"
            alt="Perro esperando adopción"
            width="500"
            height="320"
            loading="lazy"
          />
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="services">
        <h2 className="section-title">Nuestros Servicios</h2>
        <div className="services-grid">
          {[
            { icon: '💉', title: 'Vacunaciones', desc: 'Calendario completo de vacunas para perros y gatos.' },
            { icon: '🔬', title: 'Análisis clínicos', desc: 'Diagnósticos rápidos con laboratorio propio.' },
            { icon: '✂️', title: 'Peluquería', desc: 'Baño, corte y arreglo profesional.' },
            { icon: '🦷', title: 'Odontología', desc: 'Limpieza dental y extracciones.' },
            { icon: '🏥', title: 'Urgencias 24h', desc: 'Atención de emergencia disponible.' },
            { icon: '🛎️', title: 'Hotel mascotas', desc: 'Cuidamos a tu mascota cuando no puedes.' },
          ].map((s, i) => (
            <div className="service-item" key={i}>
              <span className="service-icon">{s.icon}</span>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-final">
        <h2>¿Listo para cuidar a tu mascota?</h2>
        <p>Pide tu cita ahora y recibe atención personalizada de nuestro equipo.</p>
        <Link to="/appointments" className="btn-cta">📅 Pedir Cita Ahora</Link>
      </section>

    </div>
  )
}

export default Home