import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkflowStatusBadge } from "@/components/quality/workflow/status/WorkflowStatusBadge";
import { BasicInfoTab } from "@/components/rnc/tabs/details/BasicInfoTab";
import { AdditionalInfoTab } from "@/components/rnc/tabs/details/AdditionalInfoTab";
import { RelationalInfoTab } from "@/components/rnc/tabs/details/RelationalInfoTab";
import { WorkflowTab } from "@/components/rnc/tabs/details/WorkflowTab";
import { EventsTimeline } from "@/components/rnc/details/EventsTimeline";
import { WorkflowStatusEnum } from "@/types/rnc";

export default function RNCDetails() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = React.useState(false);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="container mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/quality/home")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">RNC #123</h1>
          <WorkflowStatusBadge status={WorkflowStatusEnum.open} />
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tabs section */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="w-full grid grid-cols-2 sm:flex sm:flex-wrap gap-1 p-1 rounded-lg border border-border bg-slate-800">
                <div className="w-full grid grid-cols-2 gap-1 sm:flex sm:flex-1">
                  <TabsTrigger 
                    value="basic" 
                    className="w-full sm:flex-1 min-w-[120px] bg-[#1e293b] text-[#94a3b8] hover:bg-[#1e293b]/90 data-[state=active]:bg-[#020817] data-[state=active]:text-[#f8fafc] rounded-md"
                  >
                    Informações base
                  </TabsTrigger>
                  <TabsTrigger 
                    value="additional" 
                    className="w-full sm:flex-1 min-w-[120px] bg-[#1e293b] text-[#94a3b8] hover:bg-[#1e293b]/90 data-[state=active]:bg-[#020817] data-[state=active]:text-[#f8fafc] rounded-md"
                  >
                    Inf. Adicionais
                  </TabsTrigger>
                  <TabsTrigger 
                    value="relational" 
                    className="w-full sm:flex-1 min-w-[120px] bg-[#1e293b] text-[#94a3b8] hover:bg-[#1e293b]/90 data-[state=active]:bg-[#020817] data-[state=active]:text-[#f8fafc] rounded-md"
                  >
                    Inf. Relacionais
                  </TabsTrigger>
                  <TabsTrigger 
                    value="workflow" 
                    className="w-full sm:flex-1 min-w-[120px] bg-[#1e293b] text-[#94a3b8] hover:bg-[#1e293b]/90 data-[state=active]:bg-[#020817] data-[state=active]:text-[#f8fafc] rounded-md"
                  >
                    Workflow
                  </TabsTrigger>
                </div>
              </TabsList>

              <TabsContent value="basic" className="space-y-6 p-4">
                <BasicInfoTab isEditing={isEditing} />
              </TabsContent>

              <TabsContent value="additional" className="space-y-6 p-4">
                <AdditionalInfoTab isEditing={isEditing} />
              </TabsContent>

              <TabsContent value="relational" className="space-y-6 p-4">
                <RelationalInfoTab isEditing={isEditing} />
              </TabsContent>

              <TabsContent value="workflow" className="space-y-6 p-4">
                <WorkflowTab />
              </TabsContent>
            </Tabs>
          </div>

          {/* Events Timeline */}
          <div className="bg-card rounded-lg p-4 h-[calc(100vh-12rem)] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Histórico (Eventos)</h2>
            <EventsTimeline />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between border-t pt-4 flex-wrap gap-4">
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