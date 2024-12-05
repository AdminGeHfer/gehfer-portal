import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RNCTimeline } from "../RNCTimeline";
import { WorkflowTransition, getStatusLabel } from "@/types/workflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RNCWorkflowHistoryProps {
  rncId: string;
}

export function RNCWorkflowHistory({ rncId }: RNCWorkflowHistoryProps) {
  return <RNCTimeline rncId={rncId} />;
}