-- ====================================================================
-- GUINEVAL LOGISTICS - DATOS SEMILLA REALES
-- Empresa: Exportaciones Guineval S.L.
-- Sede España: Av. de la Séquia Real del Xúquer, 72, 46460 Silla, Valencia
-- Teléfonos: España (+34 661 532 115) | Guinea Ecuatorial (+240 222 271 440)
-- Email corporativo: daniel.alonso@exportacionesguineval.com
-- ====================================================================

USE guineval_db;

-- 1. Sedes / Almacenes
INSERT INTO warehouses (id, code, name, city, country, address, phone, email, opening_hours, is_origin, is_destination) VALUES
(1, 'VLC', 'Sede Central Guineval España', 'Valencia', 'España', 'Av. de la Séquia Real del Xúquer, 72, 46460 Silla, Valencia', '+34 661 532 115', 'daniel.alonso@exportacionesguineval.com', 'Lunes a Viernes 07:00 - 19:00', TRUE, FALSE),
(2, 'SSG', 'Centro Logístico Guineval Malabo', 'Malabo', 'Guinea Ecuatorial', 'Carretera del Aeropuerto s/n, Barrio Ela Nguema, Malabo', '+240 222 271 440', 'daniel.alonso@exportacionesguineval.com', 'Lunes a Sábado 08:00 - 18:00', FALSE, TRUE),
(3, 'BSG', 'Centro de Distribución Guineval Bata', 'Bata', 'Guinea Ecuatorial', 'Avenida de la Libertad, Zona Puerto, Bata', '+240 222 271 440', 'daniel.alonso@exportacionesguineval.com', 'Lunes a Sábado 08:00 - 18:00', FALSE, TRUE)
ON DUPLICATE KEY UPDATE 
    name=VALUES(name), 
    address=VALUES(address), 
    phone=VALUES(phone),
    email=VALUES(email);

-- 2. Configuración de Tarifas (Aéreo regular/chárter y Marítimo grupaje/contenedor completo)
INSERT INTO rates_config (
    id, service_type, cargo_category, price_per_unit_eur, minimum_charge_eur, handling_fee_eur, 
    personal_shopper_commission_pct, eur_to_xaf_rate, whatsapp_spain, whatsapp_guinea, contact_email, is_active
) VALUES
(1, 'AIR_REGULAR', 'GENERAL', 14.50, 25.00, 5.00, 10.00, 655.9570, '+34 661 532 115', '+240 222 271 440', 'daniel.alonso@exportacionesguineval.com', TRUE),
(2, 'AIR_CHARTER', 'VOLUMINOUS_CARGO', 22.00, 100.00, 20.00, 10.00, 655.9570, '+34 661 532 115', '+240 222 271 440', 'daniel.alonso@exportacionesguineval.com', TRUE),
(3, 'SEA_GROUPAGE', 'GENERAL', 380.00, 50.00, 15.00, 10.00, 655.9570, '+34 661 532 115', '+240 222 271 440', 'daniel.alonso@exportacionesguineval.com', TRUE),
(4, 'SEA_GROUPAGE', 'CONSTRUCTION_MATERIALS', 340.00, 80.00, 20.00, 10.00, 655.9570, '+34 661 532 115', '+240 222 271 440', 'daniel.alonso@exportacionesguineval.com', TRUE),
(5, 'SEA_FULL_CONTAINER', 'HEAVY_MACHINERY', 3500.00, 3500.00, 150.00, 8.00, 655.9570, '+34 661 532 115', '+240 222 271 440', 'daniel.alonso@exportacionesguineval.com', TRUE)
ON DUPLICATE KEY UPDATE 
    price_per_unit_eur=VALUES(price_per_unit_eur),
    whatsapp_spain=VALUES(whatsapp_spain),
    whatsapp_guinea=VALUES(whatsapp_guinea),
    contact_email=VALUES(contact_email);

-- 3. Usuarios de Prueba (Dirección, Operarios Silla/Malabo y Cliente)
INSERT INTO users (id, suite_code, full_name, phone, email, password_hash, role, preferred_destination_id) VALUES
(1, 'GNV-DIR01', 'Daniel Alonso (Dirección)', '+34 661 532 115', 'daniel.alonso@exportacionesguineval.com', '$2b$10$8h6V5fQ9sY8A8R2C0K1QeOBW7k9tP5.4B1I3H4p0s/Wf.q2Ym6puy', 'ADMIN', 2),
(2, 'GNV-OP-VLC', 'Operador Sede Silla (Valencia)', '+34 661 532 116', 'operaciones.silla@exportacionesguineval.com', '$2b$10$8h6V5fQ9sY8A8R2C0K1QeOBW7k9tP5.4B1I3H4p0s/Wf.q2Ym6puy', 'OPERATOR', 2),
(3, 'GNV-OP-GQ', 'Operador Sede Malabo', '+240 222 271 440', 'operaciones.malabo@exportacionesguineval.com', '$2b$10$8h6V5fQ9sY8A8R2C0K1QeOBW7k9tP5.4B1I3H4p0s/Wf.q2Ym6puy', 'OPERATOR', 2),
(4, 'GNV-C101', 'Esteban Nguema Ondo', '+240 222 334 455', 'esteban.nguema@example.com', '$2b$10$8h6V5fQ9sY8A8R2C0K1QeOBW7k9tP5.4B1I3H4p0s/Wf.q2Ym6puy', 'CUSTOMER', 2)
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), phone=VALUES(phone), email=VALUES(email);

-- 4. Envíos de Ejemplo (Shipments reales desde Valencia a Malabo y Bata)
INSERT INTO shipments (
    id, tracking_number, user_id, 
    sender_name, sender_phone, sender_email, 
    recipient_name, recipient_phone, recipient_email, recipient_city,
    origin_warehouse_id, destination_warehouse_id,
    service_type, cargo_category,
    weight_kg, length_cm, width_cm, height_cm, volumetric_weight_kg, chargeable_weight_kg, volume_m3,
    description_contents, declared_value_eur, cost_eur, cost_xaf, payment_status, current_status, estimated_delivery_date
) VALUES
(
    1, 'GNV-ES-2026-001', 4,
    'Marta Gómez Ruiz (Valencia)', '+34 611 223 344', NULL,
    'Esteban Nguema Ondo', '+240 222 334 455', 'esteban.nguema@example.com', 'Malabo',
    1, 2, -- Sede Silla (Valencia) -> Malabo
    'AIR_REGULAR', 'GENERAL',
    4.50, 30.00, 25.00, 20.00, 3.00, 4.50, 0.0150,
    'Documentación mercantil, terminal móvil y accesorios', 450.00,
    70.25, 46081.00, 'PAID', 'IN_TRANSIT', DATE_ADD(CURDATE(), INTERVAL 3 DAY)
),
(
    2, 'GNV-ES-2026-002', NULL,
    'Suministros Industriales Levante', '+34 963 889 900', NULL,
    'Construcciones y Obras del Litoral', '+240 222 998 877', NULL, 'Bata',
    1, 3, -- Sede Silla (Valencia) -> Bata
    'SEA_GROUPAGE', 'CONSTRUCTION_MATERIALS',
    180.00, 120.00, 80.00, 90.00, 172.80, 180.00, 0.8640,
    'Palet de baldosas cerámicas y material de fontanería', 2200.00,
    308.76, 202533.00, 'PAY_ON_DELIVERY', 'RECEIVED_ORIGIN', DATE_ADD(CURDATE(), INTERVAL 21 DAY)
),
(
    3, 'GNV-ES-2026-003', 4,
    'Encargo Online España (Casillero GNV-C101)', '+34 661 532 115', NULL,
    'Esteban Nguema Ondo', '+240 222 334 455', 'esteban.nguema@example.com', 'Malabo',
    1, 2, -- Sede Silla (Valencia) -> Malabo
    'AIR_REGULAR', 'GENERAL',
    2.10, 20.00, 15.00, 10.00, 0.60, 2.10, 0.0030,
    'Prendas textiles y calzado deportivo Inditex/Zara', 110.00,
    35.45, 23253.00, 'PAID', 'READY_FOR_PICKUP', CURDATE()
)
ON DUPLICATE KEY UPDATE tracking_number=VALUES(tracking_number);

-- 5. Eventos de Tracking Cronológicos
INSERT INTO tracking_events (id, shipment_id, status, location, description, operator_notes, event_timestamp) VALUES
-- Envío 1 (Aéreo Valencia -> Malabo)
(1, 1, 'REGISTERED', 'Silla, Valencia (España)', 'Expedición creada en sistema con destino Malabo (Bioko).', 'Recepción de orden', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(2, 1, 'RECEIVED_ORIGIN', 'Sede Central Silla (Valencia)', 'Mercancía recepcionada en Av. de la Séquia Real del Xúquer, 72. Pesaje verificado.', 'Peso comprobado 4.5kg', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(3, 1, 'IN_TRANSIT', 'Aeropuerto de Valencia (VLC)', 'Embarcado en conexión regular de carga aérea con destino Malabo (SSG).', 'Valija aérea #VLC-SSG-04', NOW()),

-- Envío 2 (Marítimo grupaje Valencia -> Bata)
(4, 2, 'REGISTERED', 'Silla, Valencia (España)', 'Orden de transporte marítimo en grupaje compartida generada hacia Bata.', 'Carga en muelle', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(5, 2, 'RECEIVED_ORIGIN', 'Sede Central Silla (Valencia)', 'Material de construcción recibido y asegurado en almacén para consolidación en contenedor.', 'Contenedor #VLC-2026-09', DATE_SUB(NOW(), INTERVAL 1 DAY)),

-- Envío 3 (Listo para retirar en Malabo)
(6, 3, 'REGISTERED', 'Silla, Valencia (España)', 'Paquete de compra por encargo recepcionado en sede central.', 'Comprado por Guineval', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(7, 3, 'RECEIVED_ORIGIN', 'Sede Central Silla (Valencia)', 'Clasificado para valija aérea express hacia Guinea Ecuatorial.', 'Bolsa valija #102', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(8, 3, 'IN_TRANSIT', 'En vuelo regular de carga', 'En tránsito aéreo hacia el Aeropuerto de Malabo (SSG).', 'Vuelo directo', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(9, 3, 'CUSTOMS_HOLD', 'Aduana Aeropuerto Malabo (SSG)', 'Despacho aduanero completado sin incidencias.', 'Liberado por agente aduanero', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(10, 3, 'ARRIVED_DESTINATION', 'Centro Logístico Guineval Malabo', 'Recepcionado en sede de Malabo y clasificado en estantería A-03.', 'Ubicado', DATE_SUB(NOW(), INTERVAL 6 HOUR)),
(11, 3, 'READY_FOR_PICKUP', 'Centro Logístico Guineval Malabo', 'Paquete disponible para entrega en mostrador. Notificación de aviso enviada a WhatsApp.', 'Notificado', NOW())
ON DUPLICATE KEY UPDATE 
    status=VALUES(status),
    location=VALUES(location),
    description=VALUES(description),
    operator_notes=VALUES(operator_notes);

-- 6. Solicitud de Compra Asistida (Personal Shopper)
INSERT INTO purchase_requests (
    id, request_code, user_id,
    customer_name, customer_phone, customer_email, destination_city,
    item_name, store_name, product_url, specifications, quantity, cargo_category,
    estimated_item_price_eur, service_commission_eur, shipping_estimate_eur, total_estimated_eur, total_estimated_xaf,
    preferred_shipping, status, whatsapp_message_sent, admin_notes
) VALUES
(
    1, 'REQ-2026-001', 4,
    'Esteban Nguema Ondo', '+240 222 334 455', 'esteban.nguema@example.com', 'Malabo',
    'Zapatillas Nike Air Max 270 (Hombre)', 'Nike España / Amazon',
    'https://www.nike.com/es/t/air-max-270-zapatillas-KkLcGR',
    'Color: Negro suela blanca. Talla: 43 europea. Envase original.',
    1, 'GENERAL',
    149.99, 15.00, 29.00, 193.99, 127249.00,
    'AIR_REGULAR', 'QUOTED', TRUE, 'Cotización calculada y comunicada por WhatsApp (+34 661 532 115)'
)
ON DUPLICATE KEY UPDATE request_code=VALUES(request_code);
