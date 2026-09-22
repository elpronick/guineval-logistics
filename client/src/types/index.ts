export type DestinationCity = 'Malabo' | 'Bata';

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
  sender_name: string;
  sender_phone: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_city: DestinationCity;
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
  cost_eur: number;
  cost_xaf: number;
  current_status: ShipmentStatus;
  estimated_delivery_date: string | null;
  timeline?: TrackingEvent[];
}

export interface QuoteOption {
  service_type: ServiceType;
  title: string;
  description: string;
  estimated_days: string;
  chargeable_measure: string;
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
}
