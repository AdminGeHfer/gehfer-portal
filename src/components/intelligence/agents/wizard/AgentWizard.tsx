import { useState } from "react";
import * as React from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConnectionTesting, setIsConnectionTesting] = useState(false);
  
  const { updateAgent, refreshAgents } = useAIAgents();

  const handleNext = () => {
    // Validate required fields before proceeding
    if (step === 1 && !formData.type) {
      toast.error("Por favor selecione um tipo de agente");
      return;
    }
    if (step === 2 && !formData.name) {
      toast.error("Por favor insira um nome para o agente");
      return;
    }
    if (step === 3 && (formData.type === 'n8n' || formData.type === 'flowise') && (!formData.externalUrl || !formData.authToken)) {
      toast.error("Por favor preencha todos os campos obrigatórios");
      return;
    }

    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      type: "" as AgentType,
      name: "",
      description: "",
      icon: "",
      color: "#000000",
      externalUrl: "",
      authToken: "",
      templateId: "",
    });
    onOpenChange(false);
  };

  const testConnection = async () => {
    if (!formData.externalUrl || !formData.authToken) {
      toast.error("Por favor preencha URL e token de autenticação");
      return;
    }

    setIsConnectionTesting(true);
    try {
      // Test connection based on agent type
      if (formData.type === 'n8n') {
        const response = await fetch(formData.externalUrl, {
          method: 'GET',
          headers: {
            'X-N8N-API-KEY': formData.authToken
          }
        });
        if (!response.ok) throw new Error('Falha na conexão');
      } else if (formData.type === 'flowise') {
        const response = await fetch(formData.externalUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${formData.authToken}`
          }
        });
        if (!response.ok) throw new Error('Falha na conexão');
      }
      
      toast.success("Conexão testada com sucesso!");
    } catch (error) {
      console.error("Connection test error:", error);
      toast.error("Erro ao testar conexão. Verifique as credenciais.");
    } finally {
      setIsConnectionTesting(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
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
      
      await refreshAgents();
      toast.success("Agente criado com sucesso!");
      handleClose();
    } catch (error) {
      console.error("Error creating agent:", error);
      toast.error("Erro ao criar agente");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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
              onTest={testConnection}
              isConnectionTesting={isConnectionTesting}
            />
          )}
        </div>

        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1 || isSubmitting}
          >
            Voltar
          </Button>
          
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            
            {step < 4 ? (
              <Button onClick={handleNext} disabled={isSubmitting}>
                Próximo
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Criando..." : "Criar Agente"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};