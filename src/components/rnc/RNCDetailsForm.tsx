import * as React from "react";
import { useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoTab } from "@/components/rnc/tabs/details/BasicInfoTab";
import { AdditionalInfoTab } from "@/components/rnc/tabs/details/AdditionalInfoTab";
import { RelationalInfoTab } from "@/components/rnc/tabs/details/RelationalInfoTab";
import { WorkflowTab } from "@/components/rnc/tabs/details/WorkflowTab";
import { useFormContext } from "react-hook-form";
import { UpdateRNCFormData } from "@/schemas/rncValidation";
import { Button } from "@/components/ui/button";
import { Edit, Printer, Save } from "lucide-react";
import { generatePDF } from "@/utils/pdfUtils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

interface RNCDetailsFormProps {
  rncId: string;
  rncNumber: string;
  status: string;
  onSave: (data: UpdateRNCFormData) => Promise<void>;
  isSubmitting: boolean;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

export function RNCDetailsForm({ 
  rncId, 
  rncNumber,
  status,
  onSave, 
  isSubmitting,
  isEditing,
  setIsEditing 
}: RNCDetailsFormProps) {
  const { handleSubmit } = useFormContext<UpdateRNCFormData>();
  const [activeTab, setActiveTab] = React.useState("basic");
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!printRef.current) return;
    
    try {
      await generatePDF({
        filename: `RNC-${rncNumber}.pdf`,
        element: printRef.current
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Erro ao gerar PDF");
    }
  };

  return (
    <div className="space-y-4">
      {/* Move buttons outside the form */}
      <div className="flex justify-end gap-2 mb-4">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrint}
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Imprimir
        </Button>
        
        <form onSubmit={handleSubmit(onSave)} className="inline">
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
        </form>
      </div>

      {/* Content to be printed */}
      <div ref={printRef}>
        <div className="print-header mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">RNC #{rncNumber}</h1>
            <div className="text-sm font-medium">{status}</div>
          </div>
          <p className="text-sm text-gray-500">
            Gerado em: {format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}
          </p>
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
              transitions={[]}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
