export interface Truck {
  id: string;
  plate: string;
  driver: string;
  type: string;
  company: string;
  status: 'waiting' | 'in_process' | 'completed';
  queue: string;
  entryTime: string;
  transportCompany: string;
  notes?: string | null;
  operationType: 'loading' | 'unloading' | 'both';
  weights?: {
    gross?: number;
    tare?: number;
    net?: number;
  };
  kilometers?: number;
}

export interface TruckFormData {
  driver_name: string;
  truck_type: string;
  transport_company: string;
  operation_type: 'loading' | 'unloading' | 'both';
}

export interface Operation {
  status: string;
  bay_number: number;
  initial_weight?: number;
  final_weight?: number;
  net_weight?: number;
}

export interface TachographRecord {
  mileage: number;
}