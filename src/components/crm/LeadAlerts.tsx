import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

interface Lead {
  id: string;
  name: string;
  lastUpdate: Date;
  stage: string;
}

interface LeadAlertsProps {
  leads: Lead[];
  stagnationThreshold?: number; // dias
}

export const LeadAlerts = ({ leads, stagnationThreshold = 7 }: LeadAlertsProps) => {
  const { toast } = useToast();

  const checkStagnantLeads = () => {
    const now = new Date();
    const stagnantLeads = leads.filter(lead => {
      const daysSinceUpdate = Math.floor(
        (now.getTime() - new Date(lead.lastUpdate).getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSinceUpdate >= stagnationThreshold;
    });

    return stagnantLeads;
  };

  useEffect(() => {
    const stagnantLeads = checkStagnantLeads();
    if (stagnantLeads.length > 0) {
      toast({
        title: "Leads Estagnados",
        description: `Você tem ${stagnantLeads.length} leads sem atualização há mais de ${stagnationThreshold} dias.`,
        variant: "destructive",
      });
    }
  }, [leads, stagnationThreshold]);

  const stagnantLeads = checkStagnantLeads();

  if (stagnantLeads.length === 0) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Leads Estagnados</AlertTitle>
      <AlertDescription>
        <p>Os seguintes leads estão sem atualização há mais de {stagnationThreshold} dias:</p>
        <ul className="mt-2 space-y-1">
          {stagnantLeads.map(lead => (
            <li key={lead.id} className="text-sm">
              {lead.name} - {lead.stage}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
};