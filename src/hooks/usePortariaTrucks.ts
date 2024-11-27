import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Truck } from "@/types/truck";
import { api } from "./api/portariaApi";
import { transformTruckData } from "./utils/truckTransform";
import { useQueueOptimization } from "./useQueueOptimization";

export function usePortariaTrucks() {
  const queryClient = useQueryClient();
  const { optimizeQueueDistribution } = useQueueOptimization();

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

  const optimizeQueues = () => {
    const optimizedDistribution = optimizeQueueDistribution(trucks);
    
    // Move trucks to their optimized positions
    Object.entries(optimizedDistribution).forEach(([queueId, queueTrucks]) => {
      queueTrucks.forEach((truck: Truck) => {
        if (truck.queue !== queueId) {
          moveTruck(truck.id, queueId);
        }
      });
    });
  };

  return {
    trucks,
    isLoading,
    createTruck,
    moveTruck,
    finishOperation,
    optimizeQueues,
  };
}