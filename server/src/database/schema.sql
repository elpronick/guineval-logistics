-- ====================================================================
-- GUINEVAL LOGISTICS DATABASE SCHEMA (MySQL 8.0+ / InnoDB)
-- Exportaciones Guineval S.L.
-- Sede España: Av. de la Séquia Real del Xúquer, 72, 46460 Silla, Valencia (+34 661 532 115)
-- Sede Guinea Ecuatorial: Malabo / Bata (+240 222 271 440)
-- Email contacto: daniel.alonso@exportacionesguineval.com
-- ====================================================================

CREATE DATABASE IF NOT EXISTS guineval_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE guineval_db;

-- --------------------------------------------------------------------
-- 1. TABLA: sedes / almacenes (Warehouses)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS warehouses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,       -- 'VLC' (Silla, Valencia), 'SSG' (Malabo), 'BSG' (Bata)
    name VARCHAR(100) NOT NULL,              -- 'Sede Central Guineval Valencia'
    city VARCHAR(60) NOT NULL,
    country VARCHAR(60) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,              -- +34 661 532 115 (ES) o +240 222 271 440 (GQ)
    email VARCHAR(120) NULL,                 -- daniel.alonso@exportacionesguineval.com
    opening_hours VARCHAR(100) DEFAULT 'Lunes a Viernes 07:00 - 19:00',
    is_origin BOOLEAN DEFAULT FALSE,         -- TRUE para Valencia
    is_destination BOOLEAN DEFAULT FALSE,    -- TRUE para Malabo y Bata
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 2. TABLA: usuarios (Users)
-- Identificación mediante teléfono (WhatsApp) y/o email
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    suite_code VARCHAR(20) UNIQUE,           -- Código Casillero (ej: 'GNV-C101')
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(30) NOT NULL UNIQUE,       -- Teléfono / WhatsApp
    email VARCHAR(120) NULL UNIQUE,          -- Opcional
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'OPERATOR', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
    preferred_destination_id INT NULL,       -- Malabo o Bata
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_warehouse FOREIGN KEY (preferred_destination_id) 
        REFERENCES warehouses(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 3. TABLA: tarifas y configuración económica (Rates & Settings)
-- Especialidades: Aéreo (regular/chárter) y Marítimo (grupaje LCL / completo FCL)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rates_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_type ENUM('AIR_REGULAR', 'AIR_CHARTER', 'SEA_GROUPAGE', 'SEA_FULL_CONTAINER') NOT NULL,
    cargo_category ENUM(
        'GENERAL',                -- Paquetería y compras online estándar
        'VEHICLES_CARS',          -- Vehículos y camiones
        'HEAVY_MACHINERY',        -- Maquinaria de gran tonelaje
        'VOLUMINOUS_CARGO',       -- Mercancías muy voluminosas
        'FURNITURE_APPLIANCES',   -- Mobiliario y electrodomésticos
        'CONSTRUCTION_MATERIALS', -- Baldosas y material de construcción
        'HAZARDOUS_ADR'           -- Mercancías peligrosas (ADR)
    ) NOT NULL DEFAULT 'GENERAL',
    price_per_unit_eur DECIMAL(10, 2) NOT NULL,  -- Por kg o por m³
    minimum_charge_eur DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    handling_fee_eur DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    personal_shopper_commission_pct DECIMAL(5, 2) NOT NULL DEFAULT 10.00,
    eur_to_xaf_rate DECIMAL(10, 4) NOT NULL DEFAULT 655.9570,
    whatsapp_spain VARCHAR(30) NOT NULL DEFAULT '+34 661 532 115',
    whatsapp_guinea VARCHAR(30) NOT NULL DEFAULT '+240 222 271 440',
    contact_email VARCHAR(120) NOT NULL DEFAULT 'daniel.alonso@exportacionesguineval.com',
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 4. TABLA: envíos / expediciones (Shipments)
-- Salida desde Sede Central Silla (Valencia)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS shipments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tracking_number VARCHAR(30) NOT NULL UNIQUE, -- Ej: 'GNV-ES-2026-7841'
    user_id INT NULL,
    
    -- Remitente
    sender_name VARCHAR(120) NOT NULL,
    sender_phone VARCHAR(30) NOT NULL,           -- Contacto WhatsApp España
    sender_email VARCHAR(120) NULL,
    
    -- Destinatario en Guinea Ecuatorial
    recipient_name VARCHAR(120) NOT NULL,
    recipient_phone VARCHAR(30) NOT NULL,        -- Contacto WhatsApp Guinea (+240...)
    recipient_email VARCHAR(120) NULL,
    recipient_city ENUM('Malabo', 'Bata') NOT NULL DEFAULT 'Malabo',
    
    -- Sedes físicas
    origin_warehouse_id INT NOT NULL DEFAULT 1,  -- Sede Central Valencia (Silla)
    destination_warehouse_id INT NOT NULL,       -- Malabo o Bata
    
    -- Tipo de servicio logístico
    service_type ENUM('AIR_REGULAR', 'AIR_CHARTER', 'SEA_GROUPAGE', 'SEA_FULL_CONTAINER') NOT NULL DEFAULT 'AIR_REGULAR',
    cargo_category ENUM(
        'GENERAL',
        'VEHICLES_CARS',
        'HEAVY_MACHINERY',
        'VOLUMINOUS_CARGO',
        'FURNITURE_APPLIANCES',
        'CONSTRUCTION_MATERIALS',
        'HAZARDOUS_ADR'
    ) NOT NULL DEFAULT 'GENERAL',
    
    -- Medidas y cálculo IATA
    weight_kg DECIMAL(8, 2) NOT NULL DEFAULT 1.00,
    length_cm DECIMAL(8, 2) NOT NULL DEFAULT 10.00,
    width_cm DECIMAL(8, 2) NOT NULL DEFAULT 10.00,
    height_cm DECIMAL(8, 2) NOT NULL DEFAULT 10.00,
    volumetric_weight_kg DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
    chargeable_weight_kg DECIMAL(8, 2) NOT NULL DEFAULT 1.00,
    volume_m3 DECIMAL(8, 4) NOT NULL DEFAULT 0.0010,
    
    -- Contenido y seguro
    description_contents TEXT NOT NULL,
    declared_value_eur DECIMAL(10, 2) DEFAULT 0.00,
    
    -- Importes bimoneda
    cost_eur DECIMAL(10, 2) NOT NULL,
    cost_xaf DECIMAL(12, 2) NOT NULL,
    payment_status ENUM('PENDING', 'PAID', 'PAY_ON_DELIVERY') NOT NULL DEFAULT 'PENDING',
    
    -- Estado actual de la expedición
    current_status ENUM(
        'REGISTERED',           -- Expedición creada en sistema
        'RECEIVED_ORIGIN',      -- Recepcionado en Sede Silla (Valencia)
        'IN_TRANSIT',           -- En vuelo o travesía marítima hacia Guinea Ecuatorial
        'CUSTOMS_HOLD',         -- Trámite aduanero en Malabo / Bata
        'ARRIVED_DESTINATION',  -- Llegado a centro de distribución Guinea Ecuatorial
        'READY_FOR_PICKUP',     -- Listo para entrega en mostrador (aviso WhatsApp enviado)
        'OUT_FOR_DELIVERY',     -- En reparto local puerta a puerta
        'DELIVERED',            -- Entregado al cliente
        'CANCELLED'             -- Cancelado
    ) NOT NULL DEFAULT 'REGISTERED',
    
    estimated_delivery_date DATE NULL,
    delivered_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_shipments_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_shipments_origin FOREIGN KEY (origin_warehouse_id) 
        REFERENCES warehouses(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_shipments_destination FOREIGN KEY (destination_warehouse_id) 
        REFERENCES warehouses(id) ON DELETE RESTRICT ON UPDATE CASCADE,
        
    INDEX idx_shipment_tracking (tracking_number),
    INDEX idx_shipment_status (current_status),
    INDEX idx_shipment_recipient_phone (recipient_phone),
    INDEX idx_shipment_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 5. TABLA: eventos de tracking (Tracking Updates)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tracking_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shipment_id INT NOT NULL,
    status ENUM(
        'REGISTERED',
        'RECEIVED_ORIGIN',
        'IN_TRANSIT',
        'CUSTOMS_HOLD',
        'ARRIVED_DESTINATION',
        'READY_FOR_PICKUP',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'CANCELLED'
    ) NOT NULL,
    location VARCHAR(120) NOT NULL,     -- Ej: 'Silla, Valencia' o 'Centro Malabo'
    description TEXT NOT NULL,          -- Mensaje visible para el cliente
    operator_notes VARCHAR(255) NULL,
    event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_events_shipment FOREIGN KEY (shipment_id) 
        REFERENCES shipments(id) ON DELETE CASCADE ON UPDATE CASCADE,
        
    INDEX idx_tracking_shipment (shipment_id),
    INDEX idx_tracking_timestamp (event_timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 6. TABLA: compras asistidas / personal shopper (Purchase Requests)
-- "Elija lo que quiera por internet y nosotros lo compramos y se lo enviamos a Guinea Ecuatorial"
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS purchase_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_code VARCHAR(30) NOT NULL UNIQUE, -- Ej: 'REQ-2026-1045'
    user_id INT NULL,
    
    -- Cliente
    customer_name VARCHAR(120) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,      -- WhatsApp cliente (+240... o +34...)
    customer_email VARCHAR(120) NULL,
    destination_city ENUM('Malabo', 'Bata') NOT NULL DEFAULT 'Malabo',
    
    -- Detalle de compra en España
    item_name VARCHAR(200) NOT NULL,
    store_name VARCHAR(100),                  -- Ej: 'Amazon España', 'El Corte Inglés', 'Zara'
    product_url TEXT,
    specifications TEXT,                      -- Talla, modelo, color, observaciones
    quantity INT NOT NULL DEFAULT 1,
    cargo_category ENUM(
        'GENERAL',
        'VEHICLES_CARS',
        'HEAVY_MACHINERY',
        'VOLUMINOUS_CARGO',
        'FURNITURE_APPLIANCES',
        'CONSTRUCTION_MATERIALS',
        'HAZARDOUS_ADR'
    ) NOT NULL DEFAULT 'GENERAL',
    
    -- Estimaciones económicas
    estimated_item_price_eur DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    service_commission_eur DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    shipping_estimate_eur DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_estimated_eur DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_estimated_xaf DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    
    -- Modalidad logística solicitada
    preferred_shipping ENUM('AIR_REGULAR', 'AIR_CHARTER', 'SEA_GROUPAGE', 'SEA_FULL_CONTAINER') NOT NULL DEFAULT 'AIR_REGULAR',
    
    -- Estado
    status ENUM(
        'PENDING_QUOTE',    -- Recibida
        'QUOTED',           -- Cotizada con presupuesto formal
        'APPROVED_BY_USER', -- Confirmada por el cliente vía web o WhatsApp
        'PAID',             -- Pagada
        'PURCHASED',        -- Comprada por Guineval en España
        'RECEIVED_AT_HUB',  -- Recepcionada en Sede Central Silla (Valencia)
        'DISPATCHED',       -- Asignada a guía de tracking y enviada
        'CANCELLED'
    ) NOT NULL DEFAULT 'PENDING_QUOTE',
    
    related_shipment_id INT NULL,
    whatsapp_message_sent BOOLEAN DEFAULT FALSE,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_purchases_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_purchases_shipment FOREIGN KEY (related_shipment_id) 
        REFERENCES shipments(id) ON DELETE SET NULL ON UPDATE CASCADE,
        
    INDEX idx_purchase_code (request_code),
    INDEX idx_purchase_status (status),
    INDEX idx_purchase_phone (customer_phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
