// ====================================================================
// GUINEVAL LOGISTICS - TIPOS E INTERFACES DEL DOMINIO
// ====================================================================

export type ServiceType = 
  | 'AIR_REGULAR' 
  | 'AIR_CHARTER' 
  | 'SEA_GROUPAGE' 
  | 'SEA_FULL_CONTAINER';

export type CargoCategory = 
  | 'GENERAL' 
  | 'VEHICLES_CARS' 
  | 'HEAVY_MACHINERY' 
  | 'VOLUMINOUS_CARGO' 
  | 'FURNITURE_APPLIANCES' 
  | 'CONSTRUCTION_MATERIALS' 
  | 'HAZARDOUS_ADR';

export type ShipmentStatus = 
  | 'REGISTERED' 
  | 'RECEIVED_ORIGIN' 
  | 'IN_TRANSIT' 
  | 'CUSTOMS_HOLD' 
  | 'ARRIVED_DESTINATION' 
  | 'READY_FOR_PICKUP' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'PAY_ON_DELIVERY';

export type DestinationCity = 'Malabo' | 'Bata';

export interface Warehouse {
  id: number;
  code: string;
  name: string;
  city: string;
  country: string;
  address: string;
  phone: string;
  email: string | null;
  opening_hours: string;
  is_origin: boolean;
  is_destination: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TrackingEvent {
  id: number;
  shipment_id: number;
  status: ShipmentStatus;
  location: string;
  description: string;
  operator_notes: string | null;
  event_timestamp: string;
}

export interface Shipment {
  id: number;
  tracking_number: string;
  user_id: number | null;
  sender_name: string;
  sender_phone: string;
  sender_email: string | null;
  recipient_name: string;
  recipient_phone: string;
  recipient_email: string | null;
  recipient_city: DestinationCity;
  origin_warehouse_id: number;
  destination_warehouse_id: number;
  origin_name?: string;
  destination_name?: string;
  service_type: ServiceType;
  cargo_category: CargoCategory;
  weight_kg: number;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  volumetric_weight_kg: number;
  chargeable_weight_kg: number;
  volume_m3: number;
  description_contents: string;
  declared_value_eur: number;
  cost_eur: number;
  cost_xaf: number;
  payment_status: PaymentStatus;
  current_status: ShipmentStatus;
  estimated_delivery_date: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
  timeline?: TrackingEvent[];
}

export interface RateConfig {
  id: number;
  service_type: ServiceType;
  cargo_category: CargoCategory;
  price_per_unit_eur: number;
  minimum_charge_eur: number;
  handling_fee_eur: number;
  personal_shopper_commission_pct: number;
  eur_to_xaf_rate: number;
  whatsapp_spain: string;
  whatsapp_guinea: string;
  contact_email: string;
  is_active: boolean;
}

export type PurchaseStatus = 
  | 'PENDING_QUOTE' 
  | 'QUOTED' 
  | 'APPROVED_BY_USER' 
  | 'PAID' 
  | 'PURCHASED' 
  | 'RECEIVED_AT_HUB' 
  | 'DISPATCHED' 
  | 'CANCELLED';

export interface PurchaseRequest {
  id: number;
  request_code: string;
  user_id: number | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  destination_city: DestinationCity;
  item_name: string;
  store_name: string | null;
  product_url: string | null;
  specifications: string | null;
  quantity: number;
  cargo_category: CargoCategory;
  estimated_item_price_eur: number;
  service_commission_eur: number;
  shipping_estimate_eur: number;
  total_estimated_eur: number;
  total_estimated_xaf: number;
  preferred_shipping: ServiceType;
  status: PurchaseStatus;
  related_shipment_id: number | null;
  whatsapp_message_sent: boolean;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuoteOption {
  service_type: ServiceType;
  title: string;
  description: string;
  estimated_days: string;
  chargeable_measure: string; // ej: "4.50 kg" o "0.85 m³"
  cost_eur: number;
  cost_xaf: number;
  handling_fee_eur: number;
  total_eur: number;
  total_xaf: number;
  recommended?: boolean;
}

export interface QuoteCalculationResult {
  origin: {
    name: string;
    address: string;
    city: string;
  };
  destination: {
    city: DestinationCity;
    country: string;
  };
  cargo_category: CargoCategory;
  dimensions: {
    length_cm: number;
    width_cm: number;
    height_cm: number;
    volume_m3: number;
  };
  weights: {
    real_weight_kg: number;
    volumetric_weight_kg: number;
    chargeable_air_weight_kg: number;
  };
  exchange_rate_xaf: number;
  options: QuoteOption[];
  whatsapp_links: {
    spain: string;
    guinea: string;
  };
}
