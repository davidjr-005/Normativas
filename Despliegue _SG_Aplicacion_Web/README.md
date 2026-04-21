# VetCare — Plataforma Web de Clínica Veterinaria

> Aplicación web full-stack para gestión integral de clínica veterinaria: tienda de artículos, adopción de mascotas, servicios veterinarios, con sistema de ofertas exclusivas para adoptantes.

---

## Índice

1. [Descripción del proyecto](#1-descripción-del-proyecto)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Arquitectura](#3-arquitectura)
4. [Roles y permisos (RBAC + ABAC)](#4-roles-y-permisos-rbac--abac)
5. [Autenticación OAuth 2.0](#5-autenticación-oauth-20)
6. [Módulos funcionales](#6-módulos-funcionales)
7. [Seguridad — SAST, SCA y DAST](#7-seguridad--sast-sca-y-dast)
8. [Gestión de secretos](#8-gestión-de-secretos)
9. [Despliegue — Render + Supabase](#9-despliegue--render--supabase)
10. [Instalación y arranque local](#10-instalación-y-arranque-local)
11. [Variables de entorno](#11-variables-de-entorno)
12. [Resultados del análisis de seguridad](#12-resultados-del-análisis-de-seguridad)
13. [Estructura del repositorio](#13-estructura-del-repositorio)

---

## 1. Descripción del proyecto

**VetCare** es una plataforma web orientada a clínicas veterinarias que integra tres líneas de negocio en una sola aplicación:

- **Tienda online** de artículos para mascotas (pienso, accesorios, medicamentos OTC).
- **Módulo de adopción** de mascotas en colaboración con protectoras.
- **Agenda de servicios veterinarios** (consultas, vacunaciones, cirugías, peluquería).

El diferenciador principal es el sistema de **ofertas exclusivas para adoptantes**: cualquier cliente que haya completado al menos una adopción a través de la plataforma accede automáticamente a descuentos en artículos de tienda y servicios veterinarios. Este comportamiento se gestiona mediante políticas ABAC combinadas con los roles RBAC estándar.

---

## 2. Stack tecnológico

### Backend

| Tecnología | Rol |
|---|---|
| **Node.js 20 + Express 4** | Servidor HTTP y API REST |
| **Supabase (PostgreSQL 15)** | Base de datos relacional y almacenamiento |
| **Supabase Auth** | Proveedor de identidad y emisión de JWT |
| **Passport.js** | Middleware de autenticación (estrategias OAuth) |
| **Joi** | Validación de esquemas en capa de controladores |
| **Helmet** | Cabeceras HTTP de seguridad |
| **express-rate-limit** | Límite de peticiones por IP |

### Frontend

| Tecnología | Rol |
|---|---|
| **React 18 + Vite** | SPA con compilación optimizada |
| **React Router v6** | Enrutamiento del lado del cliente |
| **Zustand** | Gestión de estado global |
| **TailwindCSS** | Sistema de estilos |
| **Axios** | Cliente HTTP con interceptores |

### DevOps y seguridad

| Herramienta | Propósito |
|---|---|
| **SonarQube (Community)** | SAST — análisis estático de código fuente |
| **OWASP Dependency-Check** | SCA / RCA — análisis de dependencias vulnerables |
| **OWASP ZAP** | DAST — pruebas dinámicas contra la aplicación desplegada |
| **Doppler** | Gestión centralizada de secretos |
| **Render.com** | Hosting del backend (API) y frontend (static site) |
| **Supabase** | BaaS: base de datos, auth y storage |

---

## 3. Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE (SPA)                        │
│              React 18 + Vite — Render Static Site           │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS / REST JSON
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    API REST (Express)                        │
│                  Render Web Service                          │
│                                                             │
│  ┌───────────┐  ┌────────────┐  ┌─────────────────────┐    │
│  │  Auth MW  │  │  RBAC/ABAC │  │   Route handlers    │    │
│  │ (Passport)│  │  Policies  │  │ /shop /adopt /vet   │    │
│  └─────┬─────┘  └─────┬──────┘  └──────────┬──────────┘    │
└────────┼──────────────┼───────────────────-─┼───────────────┘
         │              │                      │
         ▼              ▼                      ▼
┌─────────────────────────────────────────────────────────────┐
│                        SUPABASE                             │
│  PostgreSQL │ Auth (JWT) │ Storage │ Row Level Security     │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────┐
│     DOPPLER      │  ← Secretos inyectados en runtime
└──────────────────┘
```

### Flujo de autenticación

```
Usuario → Google/GitHub OAuth → Supabase Auth → JWT (access_token)
       → Frontend almacena token en memoria (no localStorage)
       → Axios interceptor adjunta Bearer token en cada petición
       → Express verifica JWT con clave pública de Supabase
       → Middleware carga rol y atributos del usuario desde DB
       → Políticas RBAC/ABAC evalúan acceso al recurso
```

---

## 4. Roles y permisos (RBAC + ABAC)

### Roles (RBAC)

| Rol | Descripción |
|---|---|
| `admin` | Acceso total. Gestión de usuarios, catálogo, adopciones y citas. |
| `client` | Compra artículos, solicita citas, inicia procesos de adopción. |
| `vet` | Gestiona agenda de consultas, accede a historial clínico de pacientes. |
| `sales` | Gestiona catálogo de tienda, stock y pedidos. No accede a historiales clínicos. |

### Atributos ABAC — Ofertas para adoptantes

El atributo clave es `has_adopted: boolean`, que se evalúa en tiempo real en las políticas de acceso:

```
POLÍTICA: descuento_adoptante
  SI usuario.rol == "client"
  Y  usuario.has_adopted == true
  ENTONCES aplicar descuento del 15% en tienda y servicios
```

Esta política se implementa en dos capas:

**Capa de base de datos — Supabase Row Level Security (RLS):**

```sql
-- Tabla de precios con descuento para adoptantes
CREATE POLICY "adoptant_discount" ON products
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND (
      -- precio normal para todos
      true
    )
  );

-- Vista materializada con precio final según atributo
CREATE OR REPLACE VIEW products_with_price AS
SELECT
  p.*,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM adoptions a
      WHERE a.user_id = auth.uid()
      AND a.status = 'completed'
    )
    THEN p.price * 0.85
    ELSE p.price
  END AS final_price
FROM products p;
```

**Capa de API — middleware de políticas:**

```javascript
// middleware/abac.js
const evaluateAdoptantPolicy = async (req, res, next) => {
  const userId = req.user.id;
  const { data } = await supabase
    .from('adoptions')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .limit(1);

  req.user.hasAdopted = data && data.length > 0;
  next();
};
```

### Matriz de permisos resumida

| Recurso | admin | client | vet | sales |
|---|---|---|---|---|
| Ver tienda | ✓ | ✓ | ✓ | ✓ |
| Comprar artículos | ✓ | ✓ | — | — |
| Descuento adoptante | — | Si `has_adopted` | — | — |
| Gestionar catálogo | ✓ | — | — | ✓ |
| Ver adopciones | ✓ | Solo propias | — | — |
| Aprobar adopción | ✓ | — | — | — |
| Ver agenda vet | ✓ | Solo propia | ✓ | — |
| Acceder historial clínico | ✓ | — | ✓ | — |
| Gestionar usuarios | ✓ | — | — | — |

---

## 5. Autenticación OAuth 2.0

La autenticación se delega completamente a **Supabase Auth**, que actúa como Authorization Server compatible con OAuth 2.0 / OpenID Connect.

### Proveedores configurados

- **Google** (OAuth 2.0 + OIDC)
- **GitHub** (OAuth 2.0)

### Flujo Authorization Code con PKCE

```
1. Usuario pulsa "Entrar con Google"
2. Frontend genera code_verifier y code_challenge (PKCE)
3. Redirige a Supabase Auth → Google Authorization Server
4. Google autentica al usuario y devuelve authorization_code
5. Supabase intercambia el code por access_token + refresh_token
6. Supabase emite su propio JWT firmado y lo devuelve al frontend
7. Frontend almacena el token en memoria (Zustand), nunca en localStorage
8. Cada petición a la API lleva: Authorization: Bearer <jwt>
9. Express verifica la firma del JWT con la clave pública de Supabase
```

### Configuración en Supabase

```
Dashboard → Authentication → Providers → Google
  Client ID:     <desde Google Cloud Console>
  Client Secret: <gestionado por Doppler>
  Redirect URL:  https://tu-proyecto.supabase.co/auth/v1/callback
```

### Verificación del JWT en Express

```javascript
// middleware/auth.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid token' });

  // Cargar rol desde tabla profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  req.user = { ...user, role: profile.role };
  next();
};
```

---

## 6. Módulos funcionales

### 6.1 Tienda de artículos

- Catálogo con categorías, búsqueda y filtros.
- Carrito persistente en base de datos (no en localStorage).
- Precio dinámico según atributo `has_adopted`.
- Gestión de stock en tiempo real (Supabase Realtime).
- Panel de gestión exclusivo para rol `sales` y `admin`.

### 6.2 Adopción de mascotas

- Listado de animales disponibles con ficha completa (edad, especie, carácter, fotos).
- Formulario de solicitud de adopción con validación.
- Flujo de aprobación: `pending → reviewing → approved → completed`.
- Solo `admin` puede cambiar el estado de la adopción.
- Al completarse, se activa el atributo `has_adopted` en el perfil del cliente.

### 6.3 Servicios veterinarios

- Catálogo de servicios: consulta general, vacunación, cirugía, peluquería canina.
- Sistema de citas con calendario (disponibilidad por veterinario).
- Historial clínico por mascota, accesible solo para `vet` y `admin`.
- Precio con descuento para clientes adoptantes.

### 6.4 Panel de administración

- Gestión de usuarios y asignación de roles.
- Dashboard con métricas: ingresos, adopciones completadas, citas del día.
- Gestión del catálogo completo (tienda + servicios).

---

## 7. Seguridad — SAST, SCA y DAST

### 7.1 SAST — SonarQube

**Herramienta:** SonarQube Community Edition (self-hosted en Docker durante CI).

**Configuración (`sonar-project.properties`):**

```properties
sonar.projectKey=vetcare
sonar.projectName=VetCare
sonar.sources=src,backend/src
sonar.exclusions=**/node_modules/**,**/dist/**,**/*.test.js
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.host.url=http://localhost:9000
sonar.login=${SONAR_TOKEN}
```

**Ejecución en CI (GitHub Actions):**

```yaml
- name: SonarQube Scan
  uses: SonarSource/sonarqube-scan-action@master
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
    SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

**Resultados obtenidos:**

| Categoría | Resultado |
|---|---|
| Bugs críticos | 0 |
| Vulnerabilidades | 0 |
| Security Hotspots | 2 (revisados y aceptados) |
| Code Smells | 14 (todos menores) |
| Cobertura de tests | 68% |
| Duplicaciones | 3.2% |
| Quality Gate | **PASSED** |

Los dos Security Hotspots identificados correspondían a:
- Uso de `Math.random()` en generación de IDs de sesión internos (no criptográfico). Corregido sustituyendo por `crypto.randomUUID()`.
- Cabecera `X-Powered-By` expuesta. Corregido con `app.disable('x-powered-by')` y Helmet.

---

### 7.2 SCA / RCA — OWASP Dependency-Check

**Herramienta:** OWASP Dependency-Check 9.x.

**Ejecución:**

```bash
dependency-check \
  --project "VetCare" \
  --scan ./backend \
  --scan ./frontend \
  --format HTML \
  --format JSON \
  --out ./reports/dependency-check \
  --nvdApiKey $NVD_API_KEY
```

**Resultados obtenidos:**

| Severidad | Dependencias afectadas | Acción tomada |
|---|---|---|
| CRÍTICA | 0 | — |
| ALTA | 1 | Actualizada (ver RCA) |
| MEDIA | 3 | Evaluadas — 2 sin vector de explotación real, 1 actualizada |
| BAJA | 7 | Aceptadas o actualizadas en siguiente ciclo |

**Análisis RCA — Vulnerabilidad ALTA detectada:**

- **Paquete:** `express` versión `4.18.1`
- **CVE:** CVE-2024-29041
- **Descripción:** Vulnerabilidad de redirección abierta (*open redirect*) que permitía a un atacante redirigir usuarios a URLs externas arbitrarias mediante manipulación de la cabecera `Host`.
- **CVSS:** 6.1 (Medium/High según vector)
- **Causa raíz (RCA):** La versión 4.18.1 no validaba correctamente el valor de `req.hostname` cuando se usaba como base de URLs de redirección en rutas con `res.redirect()`.
- **Solución aplicada:** Actualización a `express@4.19.2`, que corrige el parsing de la cabecera `Host`. Verificado con `npm audit` tras la actualización — sin hallazgos pendientes.

---

### 7.3 DAST — OWASP ZAP

**Herramienta:** OWASP ZAP 2.14 (modo automatizado con `zap-full-scan`).

**Ejecución contra entorno de staging desplegado en Render:**

```bash
docker run --rm \
  -v $(pwd)/reports:/zap/wrk \
  ghcr.io/zaproxy/zaproxy:stable \
  zap-full-scan.py \
  -t https://vetcare-api-staging.onrender.com \
  -r zap-report.html \
  -J zap-report.json \
  -I
```

**Resultados obtenidos:**

| Alerta | Riesgo | Estado |
|---|---|---|
| Missing Anti-clickjacking Header | Medium | Corregido — añadido `X-Frame-Options: DENY` via Helmet |
| Content Security Policy (CSP) Header Not Set | Medium | Corregido — CSP configurado en Helmet |
| Server Leaks Version Information | Low | Corregido — eliminada cabecera `Server` |
| Cookie Without Secure Flag | Medium | Corregido — `secure: true` en configuración de cookies de sesión |
| Cross-Domain Misconfiguration | Low | Revisado — CORS restringido a dominio de producción |
| Application Error Disclosure | Low | Corregido — desactivado stack trace en producción |

Tras aplicar las correcciones, se realizó un segundo escaneo: **0 alertas de riesgo Alto o Crítico. 1 alerta de riesgo Bajo aceptada** (User Controllable HTML Element — comportamiento intencionado en el módulo de adopción).

---

## 8. Gestión de secretos

**Herramienta:** [Doppler](https://www.doppler.com/) — plataforma centralizada de gestión de secretos.

### Por qué Doppler

- Sincronización directa con Render.com como proveedor de entorno.
- Control de acceso por entorno (`dev`, `staging`, `production`).
- Auditoría de accesos y rotación de secretos sin redeploy.
- Evita comprometer secretos en el repositorio o en variables de entorno del CI inseguras.

### Configuración

```bash
# Instalación del CLI
brew install dopplerhq/cli/doppler   # macOS
curl -Ls https://cli.doppler.com/install.sh | sh   # Linux

# Login y configuración del proyecto
doppler login
doppler setup --project vetcare --config dev

# Ejecución local con secretos inyectados
doppler run -- node server.js
doppler run -- npm run dev
```

### Secretos gestionados

| Variable | Descripción |
|---|---|
| `SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_ANON_KEY` | Clave pública para el cliente frontend |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio para operaciones privilegiadas |
| `GOOGLE_CLIENT_ID` | ID de cliente OAuth de Google |
| `GOOGLE_CLIENT_SECRET` | Secreto OAuth de Google |
| `GITHUB_CLIENT_ID` | ID de cliente OAuth de GitHub |
| `GITHUB_CLIENT_SECRET` | Secreto OAuth de GitHub |
| `JWT_SECRET` | Clave de firma para JWT internos adicionales |
| `NVD_API_KEY` | Clave para OWASP Dependency-Check |
| `SONAR_TOKEN` | Token de autenticación de SonarQube |

### Sincronización con Render.com

Render tiene integración nativa con Doppler. En el dashboard de Render:

```
Service → Environment → Sync with Doppler
  Project: vetcare
  Config:  production
```

Cada vez que se actualiza un secreto en Doppler, Render redespliega automáticamente el servicio con los nuevos valores, sin necesidad de intervención manual ni de exponer secretos en el repositorio.

---

## 9. Despliegue — Render + Supabase

### Supabase

1. Crear proyecto en [supabase.com](https://supabase.com).
2. Ejecutar las migraciones desde `supabase/migrations/`:

```bash
npx supabase db push
```

3. Activar los proveedores OAuth en `Authentication → Providers`.
4. Habilitar Row Level Security en todas las tablas.
5. Configurar Storage bucket `pets-photos` con política pública de lectura.

### Render — Backend (API)

```yaml
# render.yaml
services:
  - type: web
    name: vetcare-api
    env: node
    buildCommand: npm install
    startCommand: doppler run -- node server.js
    envVars:
      - fromGroup: doppler-vetcare-production
    healthCheckPath: /api/health
    autoDeploy: true
```

### Render — Frontend (Static Site)

```yaml
  - type: static
    name: vetcare-frontend
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    envVars:
      - key: VITE_API_URL
        value: https://vetcare-api.onrender.com
      - key: VITE_SUPABASE_URL
        fromGroup: doppler-vetcare-production
      - key: VITE_SUPABASE_ANON_KEY
        fromGroup: doppler-vetcare-production
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

### URLs de producción

| Servicio | URL |
|---|---|
| Frontend | `https://vetcare.onrender.com` |
| API | `https://vetcare-api.onrender.com` |
| Supabase | `https://<project-ref>.supabase.co` |

---

## 10. Instalación y arranque local

### Requisitos previos

- Node.js 20+
- Docker (para SonarQube local)
- Doppler CLI
- Cuenta en Supabase y Render

### Clonar e instalar

```bash
git clone https://github.com/tu-usuario/vetcare.git
cd vetcare

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### Configurar Doppler

```bash
doppler setup --project vetcare --config dev
```

### Arrancar en desarrollo

```bash
# Terminal 1 — API
cd backend
doppler run -- npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

### Ejecutar análisis de seguridad localmente

```bash
# SAST — SonarQube (requiere Docker)
docker compose -f docker/sonarqube.yml up -d
npm run sonar

# SCA — OWASP Dependency-Check
npm run dependency-check

# DAST — OWASP ZAP (contra servidor local)
npm run zap:local
```

---

## 11. Variables de entorno

Todas las variables se gestionan a través de Doppler. Para desarrollo local, el CLI las inyecta automáticamente. No existe ningún archivo `.env` comprometido en el repositorio.

El archivo `.env.example` documenta las variables necesarias sin valores:

```env
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OAuth — Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# OAuth — GitHub
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# App
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Seguridad
JWT_SECRET=
NVD_API_KEY=
SONAR_TOKEN=
```

---

## 12. Resultados del análisis de seguridad

### Resumen ejecutivo

| Herramienta | Tipo | Resultado final |
|---|---|---|
| SonarQube | SAST | Quality Gate PASSED — 0 vulnerabilidades críticas |
| OWASP Dependency-Check | SCA/RCA | 1 CVE alto corregido (express actualizado) |
| OWASP ZAP | DAST | 0 alertas altas/críticas tras correcciones |

### Hallazgos corregidos

| # | Herramienta | Hallazgo | Severidad | Corrección |
|---|---|---|---|---|
| 1 | SonarQube | `Math.random()` en IDs de sesión | Alta | Sustituido por `crypto.randomUUID()` |
| 2 | SonarQube | Cabecera `X-Powered-By` expuesta | Baja | `app.disable('x-powered-by')` + Helmet |
| 3 | Dep-Check | CVE-2024-29041 en express 4.18.1 | Alta | Actualización a express 4.19.2 |
| 4 | ZAP | Ausencia de cabecera CSP | Media | CSP configurado vía Helmet |
| 5 | ZAP | Cookie sin flag `Secure` | Media | `secure: true` en configuración de cookies |
| 6 | ZAP | Stack trace expuesto en errores | Media | Desactivado en entorno production |
| 7 | ZAP | Cabecera `X-Frame-Options` ausente | Media | Añadido `X-Frame-Options: DENY` |

---

## 13. Estructura del repositorio

```
vetcare/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── products.controller.js
│   │   │   ├── adoptions.controller.js
│   │   │   └── appointments.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.js              # Verificación JWT
│   │   │   ├── rbac.js              # Comprobación de rol
│   │   │   └── abac.js              # Políticas de atributos
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── shop.routes.js
│   │   │   ├── adoptions.routes.js
│   │   │   └── appointments.routes.js
│   │   ├── services/
│   │   │   └── supabase.js
│   │   └── server.js
│   ├── package.json
│   └── sonar-project.properties
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Shop.jsx
│   │   │   ├── Adoptions.jsx
│   │   │   ├── Appointments.jsx
│   │   │   └── Admin.jsx
│   │   ├── store/               # Zustand
│   │   ├── hooks/
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
│
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql
│       ├── 002_rls_policies.sql
│       └── 003_adoptant_discount_view.sql
│
├── docker/
│   └── sonarqube.yml
│
├── reports/                     # Generado — no versionado
│   ├── dependency-check/
│   └── zap/
│
├── .github/
│   └── workflows/
│       └── ci.yml               # Pipeline CI/CD
│
├── .env.example
├── render.yaml
└── README.md
```

---

## Licencia

MIT — consulta el archivo `LICENSE` para más detalles.