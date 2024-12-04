import { useState } from "react";
import { toast } from "sonner";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  value?: number;
  lastUpdate?: Date;
}

interface Stage {
  id: string;
  title: string;
  items: Lead[];
  probability?: number;
}

export const useSalesFunnelState = () => {
  const [stages, setStages] = useState<Stage[]>([
    {
      id: "lead",
      title: "Leads",
      items: [
        { 
          id: "1", 
          name: "Maria Silva", 
          email: "maria@email.com", 
          phone: "(11) 99999-9999",
          value: 5000,
          lastUpdate: new Date()
        },
        { 
          id: "2", 
          name: "João Santos", 
          email: "joao@email.com", 
          phone: "(11) 88888-8888",
          value: 3000,
          lastUpdate: new Date()
        },
      ],
      probability: 0.2
    },
    {
      id: "contact",
      title: "Em Contato",
      items: [
        { 
          id: "3", 
          name: "Ana Oliveira", 
          email: "ana@email.com", 
          phone: "(11) 77777-7777",
          value: 7000,
          lastUpdate: new Date()
        },
      ],
      probability: 0.4
    },
    {
      id: "proposal",
      title: "Proposta Enviada",
      items: [],
      probability: 0.6
    },
    {
      id: "negotiation",
      title: "Em Negociação",
      items: [
        { 
          id: "4", 
          name: "Carlos Lima", 
          email: "carlos@email.com", 
          phone: "(11) 66666-6666",
          value: 10000,
          lastUpdate: new Date()
        },
      ],
      probability: 0.8
    },
    {
      id: "closed",
      title: "Fechado",
      items: [],
      probability: 1
    }
  ]);

  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const handleEditStage = (stage: Stage) => {
    setEditingStageId(stage.id);
    setEditingTitle(stage.title);
  };

  const handleSaveStageTitle = () => {
    if (!editingStageId) return;

    setStages((prevStages) =>
      prevStages.map((stage) =>
        stage.id === editingStageId
          ? { ...stage, title: editingTitle }
          : stage
      )
    );
    setEditingStageId(null);
    setEditingTitle("");
  };

  const handleDeleteStage = (stageId: string) => {
    setStages((prevStages) => prevStages.filter((stage) => stage.id !== stageId));
    toast.success("Etapa removida com sucesso");
  };

  const handleAddStage = () => {
    const newStage: Stage = {
      id: `stage-${Date.now()}`,
      title: "Nova Etapa",
      items: [],
    };
    setStages([...stages, newStage]);
  };

  const handleAddLead = (lead: { name: string; email: string; phone: string }) => {
    if (stages.length === 0) {
      toast.error("Crie uma etapa primeiro para adicionar leads");
      return;
    }

    const newLead = {
      id: `lead-${Date.now()}`,
      ...lead,
    };

    setStages((prevStages) => {
      const newStages = [...prevStages];
      newStages[0] = {
        ...newStages[0],
        items: [...newStages[0].items, newLead],
      };
      return newStages;
    });

    toast.success("Lead adicionado com sucesso");
  };

  return {
    stages,
    setStages,
    editingStageId,
    editingTitle,
    setEditingTitle,
    handleEditStage,
    handleSaveStageTitle,
    handleDeleteStage,
    handleAddStage,
    handleAddLead,
  };
};