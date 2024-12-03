import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RNC } from "@/types/rnc";

export const useRNCs = () => {
  const { data: rncs = [], isLoading } = useQuery({
    queryKey: ["rncs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rncs")
        .select(`
          *,
          contacts:rnc_contacts(*),
          events:rnc_events(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const getDashboardStats = () => {
    const total = rncs.length;
    const open = rncs.filter(rnc => rnc.workflow_status === "open").length;
    const inProgress = rncs.filter(rnc => ["analysis", "resolution"].includes(rnc.workflow_status)).length;
    const closed = rncs.filter(rnc => rnc.workflow_status === "closed").length;

    // Calculate average resolution time in days
    const resolvedRncs = rncs.filter(rnc => rnc.closed_at);
    const averageResolutionTime = resolvedRncs.length > 0
      ? Math.round(
          resolvedRncs.reduce((acc, rnc) => {
            const start = new Date(rnc.created_at);
            const end = new Date(rnc.closed_at!);
            return acc + (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
          }, 0) / resolvedRncs.length
        )
      : 0;

    return {
      total,
      open,
      inProgress,
      closed,
      averageResolutionTime
    };
  };

  const createRNC = async (data: Partial<RNC>) => {
    const { data: newRNC, error } = await supabase
      .from("rncs")
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return newRNC;
  };

  return {
    rncs,
    isLoading,
    createRNC,
    getDashboardStats
  };
};