La intrusión en servidores que contienen datos personales se clasifica legalmente como una **violación de la seguridad de los datos personales** (acceso no autorizado), y las sanciones administrativas recaen sobre el **responsable o encargado del tratamiento** (la entidad que gestiona el servidor) por incumplir sus obligaciones de seguridad y confidencialidad.

A continuación, se presentan las sanciones y medidas legales aplicables, indicando su fuente legal principal:

### I. SANCIONES ADMINISTRATIVAS EN MATERIA DE PROTECCIÓN DE DATOS (RGPD / LOPDGDD)

Estas sanciones se imponen al responsable o encargado del tratamiento por no haber implementado medidas técnicas y organizativas adecuadas para proteger los datos [RGPD, Art. 25, 32; 509].

#### 1. Infracciones Muy Graves (RGPD, Artículo 83.5)

Esta categoría incluye la vulneración sustancial de principios de tratamiento, como el principio de integridad y confidencialidad (Art. 5 RGPD).

| Tipo de Sanción | Cuantía Máxima | Fuentes Principales |
| :--- | :--- | :--- |
| **Multa Pecuniaria (General)** | **20.000.000 EUR** | [RGPD (CELEX\_32016R0679), Art. 83.5, conversación previa] |
| **Multa a Empresas (Global)** | **4%** del volumen de negocio total anual global (se aplica la cifra más alta). | [RGPD (CELEX\_32016R0679), Art. 83.5, conversación previa] |

**Base Legal Relacionada:** El deber de confidencialidad (Art. 5.1.f RGPD,) y la obstrucción al ejercicio de la función inspectora de la AEPD (Art. 52 LOPDGDD),.

#### 2. Infracciones Graves (RGPD, Artículo 83.4)

Se refiere al incumplimiento de obligaciones de seguridad, notificación de incidentes (violaciones de seguridad) y documentación.

| Tipo de Sanción | Cuantía Máxima | Fuentes Principales |
| :--- | :--- | :--- |
| **Multa Pecuniaria (General)** | **10.000.000 EUR** | [RGPD (CELEX\_32016R0679), Art. 83.4, conversación previa] |
| **Multa a Empresas (Global)** | **2%** del volumen de negocio total anual global (se aplica la cifra más alta). | [RGPD (CELEX\_32016R0679), Art. 83.4, conversación previa] |

**Conductas Tipificadas:** La **falta de adopción de medidas técnicas y organizativas apropiadas para garantizar un nivel de seguridad adecuado al riesgo** (Art. 32 RGPD), el incumplimiento del deber de notificación de la violación de seguridad a la autoridad de control (Art. 33 RGPD) o al interesado (Art. 34 RGPD).

#### 3. Medidas Correctivas (Poderes de la Autoridad de Control)

La autoridad de control puede imponer, además de o en lugar de multas, medidas como:

*   Imponer una **limitación temporal o definitiva del tratamiento**, incluida su prohibición [conversación previa].
*   Ordenar el **bloqueo cautelar de los datos** [conversación previa].

### II. SANCIONES ADMINISTRATIVAS EN LA LEY DE SERVICIOS DE LA SOCIEDAD DE LA INFORMACIÓN (LSSI)

(Ley 34/2002, de 11 de julio). Aplicable a intermediarios (como *hosting* o acceso a la red,) que no cumplen órdenes de las autoridades relacionadas con contenidos ilícitos.

| Tipo de Infracción | Sanción (Multa) | Medidas Correctivas | Fuentes Principales |
| :--- | :--- | :--- | :--- |
| **Muy Grave** (Incumplimiento de suspensión de servicio) | Multa de **150.001 hasta 600.000 euros**. | El órgano competente puede ordenar la **suspensión del correspondiente servicio** (transmisión, *hosting*, acceso a la red) [124, conversación previa]. | [LSSI (BOE-A-2002-13758), conversación previa] |

**Medidas Adicionales:** El bloqueo del servicio de la sociedad de la información por parte de los proveedores de acceso a Internet debe estar motivado y ser proporcional.

### III. OTRAS RESPONSABILIDADES LEGALES

#### 1. Responsabilidad Civil (Indemnización)

*   Toda persona que haya sufrido **daños y perjuicios materiales o inmateriales** como consecuencia de una infracción del RGPD tendrá derecho a recibir una **indemnización** del responsable o encargado del tratamiento [RGPD, Art. 82; conversación previa].

#### 2. Responsabilidad Penal/Propiedad Intelectual (LPI)

Si la intrusión afecta a activos protegidos:

*   **Bases de Datos y Software:** Si el servidor contiene **bases de datos** que por la selección o disposición de sus contenidos constituyan creaciones intelectuales, estas son objeto de protección de propiedad intelectual,. Los derechos de autor y de propiedad intelectual cubren también las obras literarias o científicas expresadas por cualquier medio o soporte, tangible o intangible, incluyendo los programas de ordenador,.
*   **Acciones de LPI:** El titular del derecho infringido puede ejercer el **cese de las actividades declaradas infractoras** y exigir la **destrucción o inutilización de los ejemplares y material** que sirvan principalmente para realizar la explotación ilícita [conversación previa]. El tratamiento de infracciones relativas a **programas de ordenador** puede ser perseguible penalmente [LPI, conversación previa].

## CASO PRÁCTICO: COMPROMISO DE BASE DE DATOS Y SOFTWARE PROPIETARIO

### **1. Descripción del Escenario**

**Entidad Afectada:** **DataCorp S.L.** (Responsable del Tratamiento).
**Activos Comprometidos:** Servidor de producción que almacena una base de datos de 150.000 clientes. La base contiene **datos personales** (nombres, direcciones) y **datos de categorías especiales** (ej. historiales de salud o financieros sensibles), clasificados bajo seguridad **ALTA** [1]. El servidor también aloja un **Programa de Ordenador** y una **Base de Datos** comercial exclusiva, ambos protegidos por Derechos de Propiedad Intelectual (DPI) [2-4].
**Vector de Ataque/Negligencia:** Un atacante explota una vulnerabilidad en un sistema de acceso remoto. DataCorp no había implementado medidas técnicas apropiadas como el cifrado robusto de los datos en tránsito y en reposo [5, 6]. El atacante sustrae la base de datos completa y copia el código del software propietario, procediendo a publicarlo en un sitio web de acceso público operado por un tercero intermediario.

---

### **2. Infracciones/Delitos Cometidos**

| Sujeto Infractor | Clasificación del Acto | Eje Legal | Base de la Infracción |
| :--- | :--- | :--- | :--- |
| **DataCorp S.L.** (Responsable) | **Violación de la Seguridad** (acceso no autorizado, pérdida de integridad y confidencialidad) | Administrativo (RGPD/LOPDGDD) | Incumplimiento del Art. 5 y Art. 32 del RGPD (Fallo en la aplicación de medidas técnicas de seguridad adecuadas al riesgo) [6-8]. |
| **Atacante Externo** | **Infracción de Derechos de Explotación** | Civil/Penal (LPI) | **Reproducción** y **Comunicación Pública** no autorizada del Programa de Ordenador y la Base de Datos [9-11]. |
| **Atacante Externo** | **Acceso y Sustracción de Datos** | Penal (Código Penal) | Delitos de descubrimiento y revelación de secretos o daños informáticos (no tipificados en las fuentes proporcionadas, pero se contempla la aplicación de sanciones penales) [12]. |
| **Intermediario/Host** | **Falta de Colaboración** | Administrativo (LSSI/LPI) | Incumplimiento de la orden de la autoridad competente para **retirar o suspender el servicio** que facilita el contenido ilícito (datos/software robado) [13, 14]. |

---

### **3. Posibles Consecuencias Legales**

#### **A. Consecuencias Administrativas (DataCorp S.L. - Responsable del Tratamiento)**

La Agencia Española de Protección de Datos (AEPD) impondría sanciones por las deficiencias de seguridad.

| Tipo de Infracción | Prescripción | Sanción (RGPD, Art. 83) | Justificación (LOPDGDD/RGPD) |
| :--- | :--- | :--- | :--- |
| **Muy Grave** | Tres años | **20.000.000 EUR** o **4%** del volumen de negocio total anual global (VNTAG) [15]. | **Vulneración del principio de integridad y confidencialidad** (Art. 5 RGPD) [7, 8]. Tratamiento ilícito de **categorías especiales de datos** [16]. |
| **Grave** | Dos años | **10.000.000 EUR** o **2%** del VNTAG [17]. | **Falta de adopción de medidas de seguridad adecuadas al riesgo** (Art. 32.1 RGPD) [5, 6]. **Incumplimiento de la obligación de notificar la violación de seguridad** a la AEPD (Art. 33 RGPD) [18] o a los afectados (Art. 34 RGPD) si existe alto riesgo [19, 20]. |

**Medidas Correctivas (Artículo 58.2 RGPD):**
La AEPD puede ordenar medidas complementarias o sustitutivas, como:
*   Imponer una **limitación temporal o definitiva del tratamiento**, incluida su prohibición [21, 22].
*   Ordenar el **bloqueo cautelar de los datos** [23, 24].
*   Ordenar al responsable que **comunique a los afectados** la violación de la seguridad [21].

#### **B. Consecuencias Administrativas (Proveedor Intermediario/Host)**

Si el intermediario no colabora en la retirada del contenido ilícito (datos o software) tras ser requerido por la autoridad competente (e.g., Sección Segunda de la CPI):

*   **Infracción:** La **falta de colaboración** se considera una infracción de lo dispuesto en la Ley 34/2002 [14].
*   **Sanción Muy Grave (LPI/LSSI):** El **incumplimiento reiterado de requerimientos de retirada de contenidos declarados infractores** por parte de un mismo prestador de servicios constituye, desde la segunda vez, una infracción administrativa **muy grave** [25].
*   **Multa:** Multa de **150.001 hasta 600.000 euros** [25, 26].

#### **C. Consecuencias Judiciales (Atacante y TechHost - Civil)**

**1. Responsabilidad Civil por Daños Personales (RGPD)**
El atacante y DataCorp S.L. responden solidariamente por los daños causados [27, 28].

*   **Derecho de Indemnización:** Toda persona afectada (los 50.000 clientes) que haya sufrido **daños y perjuicios materiales o inmateriales** tiene derecho a recibir una indemnización [29].
*   **Cálculo de Daños:** La indemnización comprenderá el valor de la **pérdida sufrida** y la **ganancia que haya dejado de obtener** [30]. En caso de daño moral, procederá la indemnización, aun no probada la existencia de perjuicio económico [31].
*   **Prescripción:** La acción para reclamar daños y perjuicios prescribe a los **cinco años** [32].

**2. Acciones Civiles por Propiedad Intelectual (LPI)**

El titular del software/base de datos (DataCorp o su cliente) puede instar acciones contra el atacante (y contra los intermediarios) [33, 34].

*   **Cese de la Actividad:** Solicitar el **cese de la actividad ilícita** [33, 35].
*   **Destrucción de Material:** Solicitar la **retirada del comercio de los ejemplares ilícitos y su destrucción** [35, 36]. Esto puede incluir la destrucción del material y equipos utilizados principalmente para la reproducción, creación o fabricación de ejemplares ilícitos [37].
*   **Medidas Cautelares:** Solicitar la **suspensión de la actividad de reproducción, distribución y comunicación pública** [38].
*   **Acciones por Elusión de Medidas Tecnológicas:** El titular puede ejercitar acciones contra quienes, a sabiendas, **eludan cualquier medida tecnológica eficaz** [39, 40].

**3. Consecuencias Penales (Atacante)**

Aunque los estados miembros pueden establecer sus propias normas penales [12, 41], la LPI menciona la persecución penal en caso de infracción de derechos [42]. Si se sigue una causa criminal por infracción de derechos, el juez puede adoptar las **medidas cautelares procedentes en procesos civiles** (como el secuestro de ejemplares) [42, 43].
