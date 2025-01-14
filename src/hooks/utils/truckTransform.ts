import { Operation, TachographRecord, Truck, TruckFormData } from "@/types/truck";

export const transformTruckData = (accessLogs: unknown[], operations: unknown[]): Truck[] => {
  const transformedTrucks = [
    ...accessLogs.map((log: {truck: Truck, truck_transform: TruckFormData, entry_time: string, notes: string | null, purpose: string}) => ({
      id: log.truck.id,
      plate: log.truck.plate,
      driver: log.truck_transform.driver_name,
      type: log.truck_transform.truck_type,
      company: log.truck.company,
      status: "waiting" as const,
      queue: "waiting",
      entryTime: log.entry_time,
      transportCompany: log.truck_transform.transport_company,
      notes: log.notes,
      operationType: log.purpose as "loading" | "unloading" | "both"
    })),
    ...operations.map((op: {tachograph: TachographRecord, truck: Truck, truck_transform: TruckFormData, operation: Operation}) => ({
      id: op.truck.id,
      plate: op.truck.plate,
      driver: op.truck_transform.driver_name,
      type: op.truck_transform.truck_type,
      company: op.truck.company,
      status: op.operation.status as "waiting" | "in_process" | "completed",
      queue: op.operation.bay_number ? `baia${op.operation.bay_number}` : "waiting",
      entryTime: op.operation.entry_time,
      transportCompany: op.truck_transform.transport_company,
      notes: op.operation.notes,
      operationType: op.truck_transform.operation_type as "loading" | "unloading" | "both",
      weights: {
        gross: op.operation.initial_weight,
        tare: op.operation.final_weight,
        net: op.operation.net_weight
      },
      kilometers: op.tachograph?.[0]?.mileage
    }))
  ];

  return transformedTrucks.reduce((acc: Truck[], curr) => {
    const existingIndex = acc.findIndex(t => t.id === curr.id);
    if (existingIndex === -1) {
      acc.push(curr);
    } else if (new Date(curr.entryTime) > new Date(acc[existingIndex].entryTime)) {
      acc[existingIndex] = curr;
    }
    return acc;
  }, []).filter(truck => truck.status !== "completed");
};