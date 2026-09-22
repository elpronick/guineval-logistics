# Guineval Logistics | Plataforma de Paquetería y Compras Internacionales

[![CI - Integración Continua](https://github.com/elpronick/guineval-logistics/actions/workflows/ci.yml/badge.svg)](https://github.com/elpronick/guineval-logistics/actions/workflows/ci.yml)
[![Deploy to GitHub Pages](https://github.com/elpronick/guineval-logistics/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/elpronick/guineval-logistics/actions/workflows/deploy-pages.yml)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![SASS](https://img.shields.io/badge/SASS_7--1-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL_8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

🌐 **Demo en Vivo:** [https://elpronick.github.io/guineval-logistics/](https://elpronick.github.io/guineval-logistics/)

Plataforma integral orientada a digitalizar y optimizar las operaciones de transporte logístico, cotización de tarifas y compras por encargo (Personal Shopper) entre **España (Sede Central en Silla, Valencia)** y **Guinea Ecuatorial (Malabo y Bata)** para la empresa **Exportaciones Guineval S.L.**

---

## 🚀 Problema de Negocio y Solución

### El Desafío
- Operaciones dispersas y no estructuradas gestionadas manualmente vía WhatsApp.
- Falta de un rastreador público (tracking) que permita al cliente consultar el estado y la fecha estimada de llegada de su paquete.
- Cálculo de tarifas opaco y ausencia de conversión entre **Euros (€)** y **Francos CFA (XAF)**.

### La Solución Guineval Logistics
1. **Rastreador de Guías en Tiempo Real:** Búsqueda rápida sin necesidad de registro, visualización de la ruta (**Valencia ➔ Malabo / Bata**) y línea de tiempo de estados (*Registrado*, *Almacén Valencia*, *En Tránsito Aéreo/Marítimo*, *Aduanas*, *Listo para Retirada*).
2. **Cotizador Inteligente con Cubicaje IATA:**
   $$\text{Peso Volumétrico (kg)} = \frac{\text{Largo} \times \text{Ancho} \times \text{Alto}}{5000}$$
   Comparativa de costes en vivo: **Carga Aérea Regular** vs **Carga Marítima en Grupaje (LCL)** o contenedor completo (FCL).
3. **Selector Bimoneda Dinámico (EUR € / XAF CFA):** Conversión automática en tiempo real con paridad oficial BEAC (655.957).
4. **Módulo Personal Shopper (Compras en España):**
   > *"Elija lo que quiera por internet y nosotros lo compramos y se lo enviamos a Guinea Ecuatorial."*
   El cliente introduce el enlace del producto en tiendas españolas (Amazon, Zara, tiendas de repuestos o farmacias), el sistema desglosa los importes y genera una solicitud estructurada directa a WhatsApp.
5. **Casillero Virtual y Sedes Propias:**
   - **Sede Central España:** Av. de la Séquia Real del Xúquer, 72, 46460 Silla, Valencia (`+34 661 532 115`).
   - **Centro Logístico Malabo (Bioko):** Carretera del Aeropuerto, Malabo (`+240 222 271 440`).
   - **Centro de Distribución Bata (Litoral):** Avenida de la Libertad, Zona Puerto, Bata (`+240 222 271 440`).

---

## 🛠️ Pila Tecnológica y Arquitectura

### Frontend (`client/`)
- **React 19 + TypeScript:** Inicializado con Vite para un rendimiento ultra-rápido.
- **Arquitectura SASS (Patrón 7-1):**
  - `abstracts/`: Variables de color corporativo (Navy `#121526`, Dorado `#f5a623`), mixins responsive y funciones.
  - `base/`: Reset moderno, tipografías oficiales (`Outfit`, `Plus Jakarta Sans`) y scrollbars.
  - `components/`: Botones corporativos, tarjetas con glassmorphism, inputs y badges.
  - `layout/`: Rejilla responsive, contenedor, header y footer.
  - `pages/`: Estilos de vistas principales.
  - `themes/`: Tokens del tema corporativo.
  - `vendors/`: Ajustes de librerías.
  - `main.scss`: Punto de entrada que orquesta las 7 capas.
- **SCSS Modules:** Estilos aislados por componente (`Component.module.scss`).
- **CurrencyContext:** Estado global para alternar dinámicamente entre EUR y XAF.

### Backend (`server/`)
- **Node.js + Express + TypeScript:** Arquitectura limpia en capas (**Rutas ➔ Controladores ➔ Servicios ➔ Modelos**).
- **Zod:** Validación estricta de esquemas de entrada en tiempo de ejecución.
- **MySQL 8.0 (InnoDB):** Integridad referencial con claves foráneas, soporte UTF-8 completo (`utf8mb4`) y transacciones.
- **Resiliencia:** Mecanismo de contingencia con datos de demostración y cálculo local si el servicio MySQL no está activo.

---

## 📁 Estructura del Proyecto

```
guineval-logistics/
├── client/                     # Frontend SPA (React + TypeScript + Vite + SASS 7-1)
│   ├── src/
│   │   ├── components/         # Componentes (Tracking, Calculator, Shopper, Services, Warehouses)
│   │   ├── context/            # CurrencyContext (EUR / XAF)
│   │   ├── services/           # ApiService con llamadas REST
│   │   ├── styles/             # Arquitectura SASS 7-1 completa
│   │   └── types/              # Interfaces TypeScript
│   └── package.json
│
├── server/                     # Backend REST API (Node.js + Express + TS + MySQL)
│   ├── src/
│   │   ├── config/             # Configuración pool MySQL y variables de entorno
│   │   ├── controllers/        # Controladores HTTP
│   │   ├── database/           # schema.sql y seeds.sql
│   │   ├── middlewares/        # Manejador de errores y validación Zod
│   │   ├── services/           # Lógica de negocio (fórmulas IATA, divisas, WhatsApp)
│   │   └── routes/             # Endpoints /api/tracking, /api/quotes, etc.
│   └── package.json
│
├── docs/                       # Documentación técnica y diagramas de flujo Mermaid
│   └── database_diagrams.md
├── package.json                # Scripts raíz del proyecto
└── README.md
```

---

## ⚡ Puesta en Marcha Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/elpronick/guineval-logistics.git
cd guineval-logistics
```

### 2. Instalar dependencias
```bash
# En el cliente
cd client && npm install

# En el servidor
cd ../server && npm install
```

### 3. Iniciar en modo desarrollo
Desde la raíz del proyecto:
```bash
# Iniciar el Frontend (React + Vite)
npm run dev

# En otra terminal, iniciar el Backend API (Express)
npm run dev:server
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend:** [http://localhost:4000](http://localhost:4000)

---

## 📄 Licencia y Autor
Desarrollado por **Francisco G. Tillhet** para portfolio profesional y propuesta de modernización para **Exportaciones Guineval S.L.**
