import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { NewLeadDialog } from "@/components/crm/NewLeadDialog";
import { Stage } from "@/components/crm/Stage";
import { DraggableLeadCard } from "@/components/crm/DraggableLeadCard";
import { useSalesFunnelState } from "@/hooks/useSalesFunnelState";
import { LeadAlerts } from "@/components/crm/LeadAlerts";

const SalesFunnel = () => {
  const {
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
  } = useSalesFunnelState();

  const [activeId, setActiveId] = useState<string | null>(null);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 150,
      tolerance: 8,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeStage = stages.find((stage) =>
      stage.items.some((item) => item.id === active.id)
    );
    const overStage = stages.find((stage) => stage.id === over.id);

    if (!activeStage || !overStage || activeStage.id === overStage.id) return;

    setStages((prevStages) => {
      const activeItem = activeStage.items.find((item) => item.id === active.id);
      if (!activeItem) return prevStages;

      return prevStages.map((stage) => {
        if (stage.id === activeStage.id) {
          return {
            ...stage,
            items: stage.items.filter((item) => item.id !== active.id),
          };
        }
        if (stage.id === overStage.id) {
          return {
            ...stage,
            items: [...stage.items, activeItem],
          };
        }
        return stage;
      });
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;

    const activeStage = stages.find((stage) =>
      stage.items.some((item) => item.id === active.id)
    );
    const overStage = stages.find((stage) => stage.id === over.id);

    if (!activeStage || !overStage || activeStage.id === overStage.id) return;

    setStages((prevStages) => {
      const activeItem = activeStage.items.find((item) => item.id === active.id);
      if (!activeItem) return prevStages;

      return prevStages.map((stage) => {
        if (stage.id === activeStage.id) {
          return {
            ...stage,
            items: stage.items.filter((item) => item.id !== active.id),
          };
        }
        if (stage.id === overStage.id) {
          return {
            ...stage,
            items: [...stage.items, activeItem],
          };
        }
        return stage;
      });
    });
  };

  const getActiveItem = () => {
    if (!activeId) return null;

    for (const stage of stages) {
      const item = stage.items.find((item) => item.id === activeId);
      if (item) return item;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Funil de Vendas</h1>
          <p className="text-muted-foreground">
            Gerencie suas oportunidades de venda
          </p>
        </div>
        <div className="flex items-center gap-2">
          <NewLeadDialog onAddLead={handleAddLead} />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleAddStage}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <LeadAlerts 
        leads={stages.flatMap(stage => 
          stage.items.map(item => ({
            ...item,
            stage: stage.title,
            lastUpdate: new Date(),
          }))
        )} 
      />

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 h-[calc(100vh-12rem)]">
          {stages.map((stage) => (
            <SortableContext
              key={stage.id}
              items={stage.items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <Stage
                {...stage}
                isEditing={editingStageId === stage.id}
                editingTitle={editingTitle}
                onEdit={() => handleEditStage(stage)}
                onDelete={() => handleDeleteStage(stage.id)}
                onSave={handleSaveStageTitle}
                onCancel={() => setEditingTitle("")}
                onTitleChange={setEditingTitle}
              />
            </SortableContext>
          ))}
        </div>
        <DragOverlay dropAnimation={null} modifiers={[restrictToWindowEdges]}>
          {activeId && getActiveItem() ? (
            <Card className="w-full shadow-lg">
              <DraggableLeadCard {...getActiveItem()!} />
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default SalesFunnel;