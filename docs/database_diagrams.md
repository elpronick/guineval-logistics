# Arquitectura de Datos y Diagramas de Flujo - Exportaciones Guineval S.L.

Este documento contiene la documentación gráfica y técnica del modelo relacional definido en [`server/src/database/schema.sql`](../server/src/database/schema.sql), ajustado con los datos corporativos oficiales de **Exportaciones Guineval S.L.**:

- **Sede Central de Salida (España):** Av. de la Séquia Real del Xúquer, 72, 46460 Silla, Valencia.
- **Teléfonos de Contacto / WhatsApp:**
  - **España:** `+34 661 532 115`
  - **Guinea Ecuatorial:** `+240 222 271 440`
- **Email Corporativo:** `daniel.alonso@exportacionesguineval.com`
- **Destinos en Guinea Ecuatorial:** Malabo (Isla de Bioko) y Bata (Litoral / Continental).
- **Línea Estratégica (Personal Shopper):** *"Elija lo que quiera por internet y nosotros lo compramos y se lo enviamos a Guinea Ecuatorial"*.
- **Servicios Clave:**
  - Contenedores completos (FCL) y compartidos/grupajes (LCL).
  - Vuelos regulares y chárter de carga.
  - Especialistas en: vehículos/camiones, maquinaria pesada, mobiliario/electrodomésticos, material de construcción (baldosas) y mercancías peligrosas (ADR).

---

## 1. Diagrama Entidad-Relación (ER)

```mermaid
erDiagram
    WAREHOUSES ||--o{ USERS : "asigna sede habitual de recogida (Malabo o Bata)"
    WAREHOUSES ||--o{ SHIPMENTS : "sede origen (Silla - Valencia)"
    WAREHOUSES ||--o{ SHIPMENTS : "sede destino (Malabo o Bata)"
    USERS ||--o{ SHIPMENTS : "registra / recibe envíos"
    USERS ||--o{ PURCHASE_REQUESTS : "solicita compras asistidas"
    SHIPMENTS ||--o{ TRACKING_EVENTS : "genera historial cronológico"
    SHIPMENTS ||--o| PURCHASE_REQUESTS : "se vincula al ser despachado"

    WAREHOUSES {
        int id PK
        varchar code UK "VLC (Silla), SSG (Malabo), BSG (Bata)"
        varchar name "Sede Central Valencia / Malabo / Bata"
        varchar city "Valencia, Malabo, Bata"
        varchar country "España / Guinea Ecuatorial"
        varchar address "Av. de la Séquia Real del Xúquer, 72, Silla"
        varchar phone "+34 661 532 115 / +240 222 271 440"
        varchar email "daniel.alonso@exportacionesguineval.com"
        varchar opening_hours "L-V 07:00 - 19:00"
        boolean is_origin "TRUE para Silla"
        boolean is_destination "TRUE para Malabo y Bata"
        boolean is_active
    }

    USERS {
        int id PK
        varchar suite_code UK "Casillero (ej. GNV-C101)"
        varchar full_name "Nombre completo"
        varchar phone UK "WhatsApp (+34... o +240...)"
        varchar email UK "Opcional"
        varchar password_hash
        enum role "ADMIN, OPERATOR, CUSTOMER"
        int preferred_destination_id FK
    }

    RATES_CONFIG {
        int id PK
        enum service_type "AIR_REGULAR, AIR_CHARTER, SEA_GROUPAGE, SEA_FULL_CONTAINER"
        enum cargo_category "GENERAL, VEHICLES, MACHINERY, ADR, etc."
        decimal price_per_unit_eur "Por kg o por m3"
        decimal minimum_charge_eur
        decimal handling_fee_eur
        decimal personal_shopper_commission_pct "10%"
        decimal eur_to_xaf_rate "655.9570"
        varchar whatsapp_spain "+34 661 532 115"
        varchar whatsapp_guinea "+240 222 271 440"
        varchar contact_email "daniel.alonso@exportacionesguineval.com"
    }

    SHIPMENTS {
        int id PK
        varchar tracking_number UK "GNV-ES-2026-XXXX"
        int user_id FK "Opcional"
        int origin_warehouse_id FK "Sede Silla (Valencia)"
        int destination_warehouse_id FK "Malabo o Bata"
        enum service_type "Aéreo o Marítimo (grupaje/completo)"
        enum cargo_category "General, Maquinaria, Vehículos, etc."
        varchar sender_phone "WhatsApp remitente"
        varchar recipient_phone "WhatsApp destinatario"
        enum recipient_city "Malabo, Bata"
        decimal weight_kg "Peso báscula"
        decimal volumetric_weight_kg "(L*W*H)/5000"
        decimal chargeable_weight_kg "MAX(real, volumétrico)"
        decimal volume_m3 "Metros cúbicos"
        decimal cost_eur "Euros"
        decimal cost_xaf "Francos CFA"
        enum payment_status "PENDING, PAID, PAY_ON_DELIVERY"
        enum current_status "REGISTERED, IN_TRANSIT, etc."
    }

    TRACKING_EVENTS {
        int id PK
        int shipment_id FK
        enum status "Estado del hito"
        varchar location "Ubicación (Silla, Barajas, Malabo, Bata)"
        text description "Mensaje cliente"
        varchar operator_notes "Notas internas"
        timestamp event_timestamp "Fecha/hora"
    }

    PURCHASE_REQUESTS {
        int id PK
        varchar request_code UK "REQ-2026-XXXX"
        int user_id FK "Opcional"
        int related_shipment_id FK "Vinculado a shipment"
        varchar customer_name
        varchar customer_phone "WhatsApp cliente"
        enum destination_city "Malabo, Bata"
        varchar item_name "Producto en tiendas ES"
        text product_url "Enlace tienda"
        decimal total_estimated_eur
        decimal total_estimated_xaf
        enum preferred_shipping "Aéreo regular/chárter o Marítimo"
        enum status "PENDING_QUOTE, QUOTED, PAID, etc."
    }
```

---

## 2. Diagrama de Flujo Operativo y Ciclo de Vida del Paquete

```mermaid
flowchart TD
    %% 1. Entrada y cotización
    subgraph S1["1. Entrada al Sistema y Cotizaciones"]
        COT["Cotizador Web: Aéreo / Grupaje Marítimo / Contenedor"] --> CALC["Cálculo IATA: Peso Real vs Volumétrico (L*W*H / 5000)"]
        CALC --> CURR["Conversión Automática: EUR (€) ↔ CFA (XAF)"]
        REQ["Personal Shopper: 'Elija lo que quiera por internet'"] --> PR_CREATE["INSERT en purchase_requests<br/>(Estado: PENDING_QUOTE)"]
        PR_CREATE --> WA_BRIDGE["Enviar cotización a WhatsApp:<br/>ES (+34 661 532 115) o GQ (+240 222 271 440)"]
    end

    %% 2. Recepción física en Silla (Valencia)
    subgraph S2["2. Recepción en España (Sede Silla - Valencia)"]
        VLC["Recepción en Nave: Av. de la Séquia Real del Xúquer, 72, Silla"]
        SHIP_CREATE["INSERT en shipments<br/>(Guía única: GNV-ES-XXXX)<br/>Estado: REGISTERED"]
        VLC --> SHIP_CREATE
        CURR --> SHIP_CREATE
    end

    %% 3. Trazabilidad de estados
    subgraph S3["3. Trazabilidad y Línea de Tiempo (INSERT en tracking_events)"]
        E1["1. REGISTERED: Expedición generada en sistema"] --> E2["2. RECEIVED_ORIGIN: Pesado y clasificado en Silla (Valencia)"]
        E2 --> E3["3. IN_TRANSIT: Salida en Vuelo (regular/chárter) o Barco (grupaje/FCL)"]
        E3 --> E4["4. CUSTOMS_HOLD: Despacho e inspección aduanera en Guinea"]
        E4 --> E5["5. ARRIVED_DESTINATION: Recepción en sede local"]
        E5 --> E6["6. READY_FOR_PICKUP: Aviso por WhatsApp de paquete listo"]
        E6 --> E7["7. DELIVERED: Entregado en mostrador o puerta a puerta"]
    end

    %% 4. Distribución en Guinea Ecuatorial
    subgraph S4["4. Distribución en Guinea Ecuatorial"]
        SSG["Centro Logístico Malabo (Bioko)"]
        BSG["Centro de Distribución Bata (Litoral)"]
    end

    SHIP_CREATE --> E1
    E1 -.->|Actualiza current_status| SHIP_CREATE
    E5 --> SSG
    E5 --> BSG
    SSG --> E6
    BSG --> E6

    %% Conexión de compras asistidas a envío
    PR_CREATE -->|Al comprar producto en España| SHIP_CREATE
```

---

## 3. Identidad Visual para el Frontend (SASS)

Tomando como referencia los elementos de marca de la empresa:
- **Fondo primario oscuro (Navy Blue):** `#141729` (profesional, logístico y moderno).
- **Acento ámbar / dorado corporativo:** `#f5a623` / `#e5a823` (botones de acción, iconos de contacto y destacados).
- **Color secundario:** `#2a3152` para tarjetas y contenedores.
- **Tipografía de cabeceras:** Tipografía bold condensada/impactante (`Outfit` / `Barlow Condensed` / `Inter`).
- **Integración flotante:** Botón de chat rápido directo a los números oficiales de WhatsApp España (`+34 661 532 115`) y Guinea Ecuatorial (`+240 222 271 440`).
