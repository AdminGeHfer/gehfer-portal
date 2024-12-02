import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { WorkflowEditorCanvas } from "./WorkflowEditorCanvas";
import { Plus, Save } from "lucide-react";

// Define the state type to match the database enum
type WorkflowStateType = "open" | "analysis" | "resolution" | "solved" | "closing" | "closed";

export const WorkflowEditor = () => {
  useEffect(() => {
    initializeDefaultWorkflow();
  }, []);

  const initializeDefaultWorkflow = async () => {
    try {
      // Check if default workflow exists
      const { data: template } = await supabase
        .from('workflow_templates')
        .select('*')
        .eq('is_default', true)
        .single();

      if (!template) {
        // Create default workflow template
        const { data: newTemplate, error: templateError } = await supabase
          .from('workflow_templates')
          .insert({
            name: 'RNC Workflow',
            description: 'Fluxo padrão para RNCs',
            is_default: true
          })
          .select()
          .single();

        if (templateError) throw templateError;

        // Create default states with proper typing
        const states: Array<{
          workflow_id: string;
          label: string;
          state_type: WorkflowStateType;
          position_x: number;
          position_y: number;
        }> = [
          { label: 'Aberto', state_type: 'open', position_x: 100, position_y: 100, workflow_id: newTemplate.id },
          { label: 'Em Análise', state_type: 'analysis', position_x: 300, position_y: 100, workflow_id: newTemplate.id },
          { label: 'Em Resolução', state_type: 'resolution', position_x: 500, position_y: 100, workflow_id: newTemplate.id },
          { label: 'Solucionado', state_type: 'solved', position_x: 700, position_y: 100, workflow_id: newTemplate.id },
          { label: 'Em Fechamento', state_type: 'closing', position_x: 900, position_y: 100, workflow_id: newTemplate.id },
          { label: 'Encerrado', state_type: 'closed', position_x: 1100, position_y: 100, workflow_id: newTemplate.id }
        ];

        const { data: createdStates, error: statesError } = await supabase
          .from('workflow_states')
          .insert(states)
          .select();

        if (statesError) throw statesError;

        // Create transitions between states
        const transitions = [];
        for (let i = 0; i < createdStates.length - 1; i++) {
          transitions.push({
            workflow_id: newTemplate.id,
            from_state_id: createdStates[i].id,
            to_state_id: createdStates[i + 1].id,
            label: `${createdStates[i].label} → ${createdStates[i + 1].label}`
          });
        }

        const { error: transitionsError } = await supabase
          .from('workflow_transitions')
          .insert(transitions);

        if (transitionsError) throw transitionsError;

        toast.success('Workflow padrão criado com sucesso');
      }
    } catch (error) {
      console.error('Error initializing workflow:', error);
      toast.error('Erro ao inicializar workflow');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Editor de Workflow</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Novo Estado
              </Button>
              <Button size="sm">
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <WorkflowEditorCanvas />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default WorkflowEditor;