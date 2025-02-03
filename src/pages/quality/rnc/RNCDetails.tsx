import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoTab } from "@/components/rnc/tabs/details/BasicInfoTab";
import { AdditionalInfoTab } from "@/components/rnc/tabs/details/AdditionalInfoTab";
import { RelationalInfoTab } from "@/components/rnc/tabs/details/RelationalInfoTab";
import { WorkflowTab } from "@/components/rnc/tabs/details/WorkflowTab";
import { useFormContext } from "react-hook-form";
import { UpdateRNCFormData } from "@/schemas/rncValidation";
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";

interface RNCDetailsProps {
  rncId: string;
  onSave: (data: UpdateRNCFormData) => Promise<void>;
  isSubmitting: boolean;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

export function RNCDetails({ 
  rncId, 
  onSave, 
  isSubmitting,
  isEditing,
  setIsEditing 
}: RNCDetailsProps) {
  const { handleSubmit } = useFormContext<UpdateRNCFormData>();
  const [activeTab, setActiveTab] = React.useState("basic");

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <div className="flex justify-end mb-4">
        {!isEditing ? (
          <Button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="basic">Inf. Básicas</TabsTrigger>
          <TabsTrigger value="additional">Inf. Adicionais</TabsTrigger>
          <TabsTrigger value="relational">Inf. Relacionais</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <BasicInfoTab isEditing={isEditing} />
        </TabsContent>

        <TabsContent value="additional">
          <AdditionalInfoTab isEditing={isEditing} />
        </TabsContent>

        <TabsContent value="relational">
          <RelationalInfoTab rncId={rncId} isEditing={isEditing} />
        </TabsContent>

        <TabsContent value="workflow">
          <WorkflowTab 
            rncId={rncId} 
            isEditing={isEditing}
            transitions={[]} // You'll need to pass the actual transitions here
          />
        </TabsContent>
      </Tabs>
    </form>
  );
}
