import { Truck } from "@/types/truck";

export function useQueueOptimization() {
  const optimizeQueueDistribution = (trucks: Truck[]) => {
    const waitingTrucks = trucks.filter(t => t.status === "waiting");
    const availableBays = ["baia1", "baia2", "baia3", "baia4", "baia5"];
    
    // Sort trucks by waiting time (FIFO)
    const sortedTrucks = [...waitingTrucks].sort((a, b) => 
      new Date(a.entryTime).getTime() - new Date(b.entryTime).getTime()
    );

    // Get current bay occupancy
    const bayOccupancy = availableBays.reduce((acc, bay) => {
      acc[bay] = trucks.filter(t => t.queue === bay).length;
      return acc;
    }, {} as Record<string, number>);

    // Distribute trucks evenly across bays
    const distribution: Record<string, Truck[]> = {
      waiting: []
    };

    sortedTrucks.forEach(truck => {
      // Find bay with lowest occupancy
      const [bestBay] = Object.entries(bayOccupancy)
        .sort(([,a], [,b]) => a - b)[0];

      if (bayOccupancy[bestBay] < 2) { // Max 2 trucks per bay
        distribution[bestBay] = distribution[bestBay] || [];
        distribution[bestBay].push(truck);
        bayOccupancy[bestBay]++;
      } else {
        distribution.waiting.push(truck);
      }
    });

    return distribution;
  };

  return { optimizeQueueDistribution };
}