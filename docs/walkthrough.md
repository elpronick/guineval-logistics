# Walkthrough: Plataforma Logística Exportaciones Guineval S.L.

Se ha implementado con éxito la plataforma logística integral de **Exportaciones Guineval S.L.** (España ⇄ Guinea Ecuatorial) con arquitectura completa en Frontend (React + TypeScript + Vite + SASS 7-1) y Backend (Node.js + Express + TypeScript + MySQL InnoDB).

---

## 1. Demostración Visual en Vídeo

A continuación se muestra la grabación de la sesión interactiva realizada en el navegador:

![Demostración en Vivo Guineval Logistics](file:///C:/Users/usu/.gemini/antigravity-ide/brain/b4939e9d-67de-4d6b-b910-f8a30266f0b4/guineval_demo_1790089299233.webp)

---

## 2. Capturas de Pantalla de las Funcionalidades

````carousel
![1. Cabecera Hero y Buscador de Tracking](file:///C:/Users/usu/.gemini/antigravity-ide/brain/b4939e9d-67de-4d6b-b910-f8a30266f0b4/homepage_loaded_1790089390403.png)
<!-- slide -->
![2. Tarjeta de Tracking y Ruta Valencia -> Malabo](file:///C:/Users/usu/.gemini/antigravity-ide/brain/b4939e9d-67de-4d6b-b910-f8a30266f0b4/tracking_card_result_1790089566648.png)
<!-- slide -->
![3. Línea de Tiempo Cronológica de Estados](file:///C:/Users/usu/.gemini/antigravity-ide/brain/b4939e9d-67de-4d6b-b910-f8a30266f0b4/tracking_timeline_1790089602741.png)
<!-- slide -->
![4. Conversión Dinámica de Divisa en Francos CFA (XAF)](file:///C:/Users/usu/.gemini/antigravity-ide/brain/b4939e9d-67de-4d6b-b910-f8a30266f0b4/currency_toggled_xaf_1790089642804.png)
<!-- slide -->
![5. Cotizador Inteligente y Cálculo Volumétrico IATA](file:///C:/Users/usu/.gemini/antigravity-ide/brain/b4939e9d-67de-4d6b-b910-f8a30266f0b4/cotizador_calculator_1790089849086.png)
````

---

## 3. Componentes y Módulos Implementados

### A. Arquitectura SASS 7-1 (`client/src/styles/`)
- **`abstracts/`**: Variables de color corporativo (Navy `#121526`, Dorado `#f5a623`), mixins responsive, funciones `rem()` y gradientes.
- **`base/`**: Reset moderno, tipografías oficiales (`Outfit` y `Plus Jakarta Sans`) y scrollbars oscuros.
- **`components/`**: Botones (`.btn-gold`, `.btn-whatsapp`), tarjetas (`.card-interactive`, `.card-glass`), inputs con addons y badges de estado.
- **`layout/`**: Rejilla responsive, contenedor y estructura de header/footer.
- **`pages/`**: Estilos dedicados para landing, tracking y calculadora.
- **`themes/`**: Variables CSS de tema corporativo.
- **`vendors/`**: Normalización de librerías externas.
- **`main.scss`**: Archivo maestro que orquesta las 7 capas.

### B. Módulos de la Aplicación
1. **Rastreador de Guías (`TrackingSection.tsx`):**
   - Búsqueda en vivo por código (ej: `GNV-ES-2026-001`, `GNV-ES-2026-002`, `GNV-ES-2026-003`).
   - Stepper visual cronológico con estados: *Registrado*, *Recibido en Silla (Valencia)*, *En Tránsito*, *Aduanas*, *Listo para retirar*.
   - Botón directo para consultar incidencias por WhatsApp.

2. **Cotizador / Calculadora Inteligente (`CalculatorSection.tsx`):**
   - Fórmulas oficiales IATA:
     $$\text{Peso Volumétrico (kg)} = \frac{\text{Largo (cm)} \times \text{Ancho (cm)} \times \text{Alto (cm)}}{5000}$$
   - Comparativa lado a lado: **Carga Aérea Regular** vs **Carga Marítima Grupaje (LCL)**.
   - Cálculo simultáneo en **Euros (€)** y **Francos CFA (XAF)**.

3. **Personal Shopper / Compras en España (`PersonalShopperSection.tsx`):**
   - *"Elija lo que quiera por internet y nosotros lo compramos y se lo enviamos a Guinea Ecuatorial."*
   - Desglose transparente: Precio del producto + 10% de comisión + Envío estimado.
   - Generación automática de pre-orden (`REQ-2026-XXXX`) y apertura directa de WhatsApp con mensaje estructurado.

4. **Sedes Físicas y Casillero Virtual (`WarehousesSection.tsx`):**
   - Sede Central España: **Av. de la Séquia Real del Xúquer, 72, 46460 Silla, Valencia** (+34 661 532 115).
   - Centros de entrega: **Malabo (Bioko)** y **Bata (Litoral)** (+240 222 271 440).
   - Botón con un clic para copiar la dirección de entrega para compras personales directas.

5. **Servicios Especializados (`ServicesSection.tsx`):**
   - Contenedores completos (FCL), grupajes (LCL), vuelos chárter, mercancías peligrosas (ADR), vehículos y material de construcción.

---

## 4. Estado de los Servidores

- **Backend API (Node.js + Express + TypeScript):**
  - Activo en `http://localhost:4000`
  - Endpoints probados: `/api/health`, `/api/tracking/:code`, `/api/quotes/calculate`, `/api/purchases/request`, `/api/warehouses`
- **Frontend SPA (Vite + React + TypeScript + SASS):**
  - Activo en `http://localhost:5173`
  - Compilación sin advertencias: `tsc -b && vite build` $\rightarrow$ tiempo de compilación: **386ms**.
