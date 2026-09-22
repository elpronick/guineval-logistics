# Plan de Implementación: Plataforma Logística y Compras Guineval (España - Guinea Ecuatorial)

Este documento define la arquitectura y hoja de ruta paso a paso para construir la plataforma integral de logística y compras internacionales para **Guineval Logistics**. El objetivo es transformar una operativa manual basada en WhatsApp y una web anticuada en una solución digital moderna, robusta y atractiva para tu portfolio profesional.

---

## 1. Visión del Producto y Objetivos de Negocio

### El Problema Actual
- **Procesos manuales por WhatsApp:** Cotizaciones, peticiones de compra y seguimiento se realizan de forma dispersa e informal.
- **Falta de visibilidad de envíos:** Los clientes no tienen un seguimiento claro (tracking) en tiempo real de sus paquetes (aéreo o marítimo).
- **Cálculo de tarifas opaco:** Dificultad para que los usuarios estimen costes de envío (peso real vs. volumétrico).

### La Solución Guineval Logistics
1. **Rastreador de Envíos Público (Tracking):** Búsqueda rápida por número de guía sin requerir login, con línea de tiempo visual y estados detallados (Recepción Sede Central Silla, Valencia -> Salida Aérea/Marítima -> Aduanas Guinea -> Recepción Malabo/Bata -> Listo para entrega).
2. **Cotizador / Calculadora Inteligente:** Estimación de costes en tiempo real según peso real o volumétrico ($L \times W \times H / 5000$) y tipo de transporte:
   - **Aéreo:** Línea regular y vuelos chárter.
   - **Marítimo:** Contenedores completos (FCL) y Contenedores compartidos / grupajes (LCL).
   - **Especialidades:** Carga general, vehículos/camiones, maquinaria pesada, mobiliario/electrodomésticos, material de construcción (baldosas) y mercancías peligrosas (ADR).
3. **Manejo Bimoneda (EUR € / XAF Franco CFA):** Conversor automático de divisas integrado en toda la plataforma (1 EUR ≈ 655.957 XAF).
4. **Módulo de Compras Asistidas (Personal Shopper):** *"Elija lo que quiera por internet y nosotros lo compramos y se lo enviamos a Guinea Ecuatorial"*. El cliente añade enlaces o descripciones de productos en tiendas de España; el sistema genera el presupuesto estructurado con botón directo de confirmación hacia WhatsApp.
5. **Casillero Virtual / Dirección en España:** Asignación de dirección de entrega en la sede central de Guineval en Valencia (Silla: Av. de la Séquia Real del Xúquer, 72) para compras personales directas.
6. **Canales Oficiales de Contacto Integrados:**
   - **Teléfono / WhatsApp España:** `+34 661 532 115`
   - **Teléfono / WhatsApp Guinea Ecuatorial:** `+240 222 271 440`
   - **Email de Dirección:** `daniel.alonso@exportacionesguineval.com`
7. **Identidad Visual Corporativa:**
   - Fondo oscuro naval / logístico: `#141729` / `#1c213d`.
   - Acento dorado / ámbar prémium: `#f5a623` / `#e5a823`.
   - Tipografía limpia y moderna (Outfit / Inter) y botón flotante de WhatsApp.

---

## Decisiones de Arquitectura y Requerimientos Confirmados

- **Flujo de Rutas:** Origen único en España (**Sede Central en Av. de la Séquia Real del Xúquer, 72, Silla, Valencia**) hacia Guinea Ecuatorial (**Destinos: Malabo y Bata**).
- **Contactos Oficiales:** WhatsApp España (`+34 661 532 115`), WhatsApp Guinea Ecuatorial (`+240 222 271 440`) y correo de gestión (`daniel.alonso@exportacionesguineval.com`).
- **Monedas:** Soporte nativo para **Euros (€)** y **Francos CFA (XAF)** con selector dinámico en el encabezado.
- **Integración con WhatsApp:** Generador dinámico de mensajes a WhatsApp para pedidos y cotizaciones.
- **Arquitectura de Estilos SASS (Patrón 7-1):** Organización modular estándar de la industria combinada con SCSS Modules para componentes React:
  ```
  client/src/styles/
  ├── abstracts/     # _variables.scss, _functions.scss, _mixins.scss
  ├── base/          # _reset.scss, _typography.scss, _base.scss
  ├── components/    # _buttons.scss, _cards.scss, _inputs.scss (estilos base/globales)
  ├── layout/        # _header.scss, _footer.scss, _navigation.scss, _grid.scss
  ├── pages/         # _home.scss, _tracking.scss, _calculator.scss
  ├── themes/        # _theme-light.scss, _theme-dark.scss
  ├── vendors/       # librerías externas o iconos
  └── main.scss      # Archivo raíz que importa todas las capas
  ```

---

## Estructura del Repositorio

```
guineval-logistics/
├── server/                 # Backend Node.js + Express + TypeScript + MySQL
│   ├── src/
│   │   ├── config/         # Conexión MySQL pool, variables de entorno
│   │   ├── controllers/    # Controladores (HTTP req/res)
│   │   ├── routes/         # Definición de endpoints REST
│   │   ├── services/       # Lógica de negocio (fórmulas volumétricas, tarifas, divisas)
│   │   ├── models/         # Consultas SQL estructuradas (InnoDB)
│   │   ├── middlewares/    # Auth JWT, validadores de entrada, error handler
│   │   ├── types/          # Tipos TypeScript
│   │   └── database/       # Scripts schema.sql y seeders
│   ├── package.json
│   └── tsconfig.json
│
└── client/                 # Frontend React + TypeScript + Vite
    ├── src/
    │   ├── assets/         # Logotipos, imágenes de almacenes, banderas, banners
    │   ├── components/     # Componentes React + *.module.scss
    │   ├── pages/          # Vistas (Home, Tracking, Cotizador, Compras, Admin)
    │   ├── styles/         # Arquitectura SASS 7-1 completa
    │   ├── services/       # Cliente API REST y helpers de WhatsApp
    │   ├── context/        # Estado global (Moneda EUR/XAF, Auth)
    │   └── types/          # Interfaces y contratos de datos
    ├── package.json
    └── vite.config.ts
```

---

## Roadmap de Implementación Paso a Paso

### Fase 1: Modelado de Datos y Script MySQL (InnoDB)
- Definición de tablas con tipos exactos, claves foráneas e índices de rendimiento:
  - `users`: Administradores, operadores y clientes.
  - `warehouses`: Almacenes de origen (Madrid, Valencia) y destino (Malabo, Bata).
  - `shipments`: Expediciones con número de seguimiento (`GNV-ES-XXXX`), origen, destino, modalidad (`AIR` / `SEA`), peso, volumen y estado actual.
  - `tracking_events`: Historial cronológico de cambios de estado, ubicación y notas.
  - `purchase_requests`: Solicitudes de compra asistida (tienda, URL, descripción, importe estimado, divisa, estado).
  - `rates`: Tarifas vigentes para aéreo (por kg) y marítimo (por m³), más factor de conversión EUR/XAF.
- Archivo [schema.sql](file:///c:/Users/usu/Documents/Repositorio%20de%20GitHub/guineval-logistics/server/src/database/schema.sql) y datos de prueba realistas.

### Fase 2: Configuración del Backend Base (Express + TypeScript)
- Configuración de `server/package.json`, `tsconfig.json`, `nodemon`/`tsx`.
- Conector MySQL con pool de conexiones en `config/database.ts`.
- Endpoints iniciales de Tracking y Cotizador probados.

### Fase 3: Inicialización del Frontend y Arquitectura SASS 7-1
- Setup de `client` con Vite + React + TypeScript.
- Montaje de las 7 carpetas SASS con tokens de diseño modernos (paleta náutica/aérea prémium, tipografía Outfit/Inter, sistema responsive).
- Creación del `CurrencyContext` (soporte dinámico EUR € / CFA XAF).

### Fase 4: Vistas Principales del Cliente
- **Landing Page:** Hero con buscador de tracking en vivo, presentación de sedes (Madrid, Valencia, Malabo, Bata) y proceso "Cómo funciona".
- **Tracking View:** Stepper interactivo con línea de tiempo y detalles del envío.
- **Calculadora / Cotizador:** Comparativa visual Aéreo vs Marítimo en EUR y XAF + botón *"Enviar cotización por WhatsApp"*.
- **Compras Asistidas:** Formulario de encargo con generador de presupuesto y mensaje a WhatsApp.

### Fase 5: Panel de Gestión (Admin) & Autenticación
- Acceso para operarios para dar de alta paquetes, asignar códigos de seguimiento y registrar cambios de estado.

---

## Plan de Verificación

### 1. Validación de Base de Datos
- Ejecutar script SQL en MySQL y verificar integridad referencial de claves foráneas.

### 2. Validación de Backend
- Compilación `tsc --noEmit`.
- Pruebas de endpoints (`GET /api/tracking/:code`, `POST /api/quotes/calculate`).

### 3. Validación de Frontend
- Compilación Vite y validación de tipos.
- Comprobación en navegador de:
  - Selector bimoneda EUR ↔ XAF.
  - Generación de mensajes preformateados para WhatsApp con codificación URL correcta.
  - Renderizado fiel de la arquitectura SASS 7-1.

