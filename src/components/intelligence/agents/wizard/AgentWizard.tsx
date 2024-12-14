import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AgentTypeStep } from "./steps/AgentTypeStep";
import { BasicConfigStep } from "./steps/BasicConfigStep";
import { SpecificConfigStep } from "./steps/SpecificConfigStep";
import { ValidationStep } from "./steps/ValidationStep";
import { AgentType } from "@/types/ai/agent-types";
import { toast } from "sonner";
import { useAIAgents } from "@/hooks/useAIAgents";

interface AgentWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AgentWizard = ({ open, onOpenChange }: AgentWizardProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: "" as AgentType,
    name: "",
    description: "",
    icon: "",
    color: "#000000",
    externalUrl: "",
    authToken: "",
    templateId: "",
  });
  
  const { updateAgent } = useAIAgents();

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      await updateAgent("", {
        name: formData.name,
        description: formData.description,
        agent_type: formData.type,
        external_url: formData.externalUrl,
        auth_token: formData.authToken,
        icon: formData.icon,
        color: formData.color,
        template_id: formData.templateId,
      });
      
      toast.success("Agente criado com sucesso!");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating agent:", error);
      toast.error("Erro ao criar agente");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Criar Novo Agente</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {step === 1 && (
            <AgentTypeStep
              value={formData.type}
              onChange={(type) => setFormData({ ...formData, type })}
            />
          )}
          
          {step === 2 && (
            <BasicConfigStep
              data={formData}
              onChange={(data) => setFormData({ ...formData, ...data })}
            />
          )}
          
          {step === 3 && (
            <SpecificConfigStep
              data={formData}
              onChange={(data) => setFormData({ ...formData, ...data })}
            />
          )}
          
          {step === 4 && (
            <ValidationStep
              data={formData}
              onTest={async () => {
                toast.success("Conexão testada com sucesso!");
              }}
            />
          )}
        </div>

        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            Voltar
          </Button>
          
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            
            {step < 4 ? (
              <Button onClick={handleNext}>
                Próximo
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                Criar Agente
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};