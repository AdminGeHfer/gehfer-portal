import { Truck } from "@/types/truck";

export const transformTruckData = (accessLogs: any[], operations: any[]): Truck[] => {
  const transformedTrucks = [
    ...accessLogs.map((log: any) => ({
      id: log.truck.id,
      plate: log.truck.plate,
      driver: log.truck.driver_name,
      type: log.truck.truck_type,
      company: log.truck.company,
      status: "waiting" as const,
      queue: "waiting",
      entryTime: log.entry_time,
      transportCompany: log.truck.transport_company,
      notes: log.notes,
      operationType: log.purpose as "loading" | "unloading" | "both"
    })),
    ...operations.map((op: any) => ({
      id: op.truck.id,
      plate: op.truck.plate,
      driver: op.truck.driver_name,
      type: op.truck.truck_type,
      company: op.truck.company,
      status: op.status as "waiting" | "in_process" | "completed",
      queue: op.bay_number ? `baia${op.bay_number}` : "waiting",
      entryTime: op.entry_time,
      transportCompany: op.truck.transport_company,
      notes: op.notes,
      operationType: op.operation_type as "loading" | "unloading" | "both",
      weights: {
        gross: op.initial_weight,
        tare: op.final_weight,
        net: op.net_weight
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