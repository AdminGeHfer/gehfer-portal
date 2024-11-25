import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Truck, TruckFormData } from "@/types/truck";

const api = {
  async fetchTrucks() {
    const [accessLogsResult, operationsResult] = await Promise.all([
      supabase
        .from("truck_access_logs")
        .select(`
          *,
          truck:trucks(*)
        `)
        .order('created_at', { ascending: false }),
      supabase
        .from("operations")
        .select(`
          *,
          truck:trucks(*),
          tachograph:tachograph_records(*)
        `)
        .order('created_at', { ascending: false })
    ]);

    if (accessLogsResult.error) throw accessLogsResult.error;
    if (operationsResult.error) throw operationsResult.error;

    return { accessLogs: accessLogsResult.data, operations: operationsResult.data };
  },

  async createTruck(data: TruckFormData & { initialKm?: number; finalKm?: number; initialKmPhoto?: File; finalKmPhoto?: File }) {
    const { data: truckData, error: truckError } = await supabase
      .from("trucks")
      .insert({
        plate: data.plate,
        driver_name: data.driver_name,
        truck_type: data.truck_type,
        transport_company: data.transport_company,
      })
      .select()
      .single();

    if (truckError) throw truckError;

    const { error: accessError } = await supabase
      .from("truck_access_logs")
      .insert({
        truck_id: truckData.id,
        purpose: data.operation_type || "loading",
        notes: data.notes
      });

    if (accessError) throw accessError;

    if (data.initialKm || data.finalKm || data.initialKmPhoto || data.finalKmPhoto) {
      let initialKmPhotoUrl = null;
      let finalKmPhotoUrl = null;

      if (data.initialKmPhoto) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('tachograph')
          .upload(`${truckData.id}/initial-km.jpg`, data.initialKmPhoto);

        if (uploadError) throw uploadError;
        initialKmPhotoUrl = uploadData.path;
      }

      if (data.finalKmPhoto) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('tachograph')
          .upload(`${truckData.id}/final-km.jpg`, data.finalKmPhoto);

        if (uploadError) throw uploadError;
        finalKmPhotoUrl = uploadData.path;
      }

      const { error: tachographError } = await supabase
        .from("tachograph_records")
        .insert({
          operation_id: truckData.id,
          record_type: "entry",
          mileage: data.initialKm,
          final_mileage: data.finalKm,
          image_url: initialKmPhotoUrl,
          final_mileage_photo_url: finalKmPhotoUrl
        });

      if (tachographError) throw tachographError;
    }

    return truckData;
  },

  async updateTruckOperation(truckId: string, newQueue: string) {
    const bayNumber = newQueue === "waiting" ? null : parseInt(newQueue.replace("baia", ""));
    const status = newQueue === "waiting" ? "waiting" : "in_process";

    const { data: existingOperations, error: fetchError } = await supabase
      .from("operations")
      .select()
      .eq("truck_id", truckId)
      .is("exit_time", null);

    if (fetchError) throw fetchError;

    if (existingOperations?.[0]) {
      const { error: updateError } = await supabase
        .from("operations")
        .update({
          bay_number: bayNumber,
          status,
          updated_at: new Date().toISOString()
        })
        .eq("id", existingOperations[0].id);

      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from("operations")
        .insert({
          truck_id: truckId,
          bay_number: bayNumber,
          status,
          operation_type: "loading"
        });

      if (insertError) throw insertError;
    }
  },

  async finishOperation(truckId: string) {
    const { data: operation, error: fetchError } = await supabase
      .from("operations")
      .select()
      .eq("truck_id", truckId)
      .is("exit_time", null)
      .single();

    if (fetchError) throw fetchError;

    const { error: updateError } = await supabase
      .from("operations")
      .update({
        status: "completed",
        exit_time: new Date().toISOString()
      })
      .eq("id", operation.id);

    if (updateError) throw updateError;
  }
};

// Transform raw data into the format needed by the UI
const transformTruckData = (accessLogs: any[], operations: any[]): Truck[] => {
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

  // Remove duplicates and keep only the most recent entries
  return transformedTrucks.reduce((acc: Truck[], curr) => {
    const existingIndex = acc.findIndex(t => t.id === curr.id);
    if (existingIndex === -1) {
      acc.push(curr);
    } else if (new Date(curr.entryTime) > new Date(acc[existingIndex].entryTime)) {
      acc[existingIndex] = curr;
    }
    return acc;
  }, []).filter(truck => truck.status !== "completed"); // Remove completed operations from Kanban
};

export function usePortariaTrucks() {
  const queryClient = useQueryClient();

  const { data: rawData, isLoading } = useQuery({
    queryKey: ["trucks"],
    queryFn: api.fetchTrucks
  });

  const trucks = rawData ? transformTruckData(rawData.accessLogs, rawData.operations) : [];

  const createTruck = useMutation({
    mutationFn: api.createTruck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
      toast.success("Caminhão registrado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao registrar caminhão: " + error.message);
    },
  });

  const moveTruck = async (truckId: string, newQueue: string) => {
    try {
      await api.updateTruckOperation(truckId, newQueue);
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
      toast.success("Caminhão movido com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao mover caminhão: " + error.message);
    }
  };

  const finishOperation = async (truckId: string) => {
    try {
      await api.finishOperation(truckId);
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
      toast.success("Operação finalizada com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao finalizar operação: " + error.message);
    }
  };

  return {
    trucks,
    isLoading,
    createTruck,
    moveTruck,
    finishOperation,
  };
}
