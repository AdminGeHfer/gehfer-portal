import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkflowStatusBadge } from "@/components/quality/workflow/status/WorkflowStatusBadge";
import { BasicInfoTab } from "@/components/rnc/tabs/details/BasicInfoTab";
import { AdditionalInfoTab } from "@/components/rnc/tabs/details/AdditionalInfoTab";
import { RelationalInfoTab } from "@/components/rnc/tabs/details/RelationalInfoTab";
import { WorkflowTab } from "@/components/rnc/tabs/details/WorkflowTab";
import { EventsTimeline } from "@/components/rnc/details/EventsTimeline";

export default function RNCDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditing, setIsEditing] = React.useState(false);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/quality/home")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">RNC #123</h1>
          <WorkflowStatusBadge status="open" />
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tabs section */}
          <div className="md:col-span-2">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="basic" className="flex-1">
                  Informações base
                </TabsTrigger>
                <TabsTrigger value="additional" className="flex-1">
                  Inf. Adicionais
                </TabsTrigger>
                <TabsTrigger value="relational" className="flex-1">
                  Inf. Relacionais
                </TabsTrigger>
                <TabsTrigger value="workflow" className="flex-1">
                  Workflow
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <BasicInfoTab isEditing={isEditing} />
              </TabsContent>

              <TabsContent value="additional">
                <AdditionalInfoTab isEditing={isEditing} />
              </TabsContent>

              <TabsContent value="relational">
                <RelationalInfoTab isEditing={isEditing} />
              </TabsContent>

              <TabsContent value="workflow">
                <WorkflowTab />
              </TabsContent>
            </Tabs>
          </div>

          {/* Events Timeline */}
          <div className="bg-card rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Histórico (Eventos)</h2>
            <EventsTimeline />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between border-t pt-4">
          <span className="text-sm text-muted-foreground">
            * Campos obrigatórios
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              {isEditing ? "Salvar" : "Editar"}
            </Button>
            <Button
              variant="destructive"
              className="flex items-center gap-2"
              onClick={() => {
                // Handle delete
              }}
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}