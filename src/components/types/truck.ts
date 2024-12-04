export interface Truck {
  id: string;
  plate: string;
  driver: string;
  type: string;
  transportCompany: string;
  status: "waiting" | "in_process" | "completed";
  queue: string;
  entryTime: string;
  company?: string;
  operationType?: "loading" | "unloading" | "both";
  notes?: string;
  weights?: {
    gross?: number;
    tare?: number;
    net?: number;
  };
  kilometers?: {
    initial?: number;
    final?: number;
    initialPhotoUrl?: string;
    finalPhotoUrl?: string;
  };
}

export interface Operation {
  id: string;
  truck_id: string;
  operation_type: "loading" | "unloading" | "both";
  status: "waiting" | "in_process" | "completed";
  bay_number: number | null;
  initial_weight: number | null;
  final_weight: number | null;
  net_weight: number | null;
  origin_destination: string | null;
  notes: string | null;
  entry_time: string;
  exit_time: string | null;
  created_at: string;
  updated_at: string;
}

export interface TachographRecord {
  id: string;
  operation_id: string;
  record_type: "entry" | "exit";
  mileage: number;
  final_mileage?: number;
  image_url: string | null;
  final_mileage_photo_url: string | null;
  created_at: string;
}

export type TruckFormData = {
  plate: string;
  driver_name: string;
  truck_type: "Truck" | "Carreta" | "Bitrem" | "Rodotrem";
  transport_company: string;
  operation_type?: "loading" | "unloading" | "both";
  notes?: string;
  initialKm?: number;
  finalKm?: number;
  initialKmPhoto?: File;
  finalKmPhoto?: File;
}