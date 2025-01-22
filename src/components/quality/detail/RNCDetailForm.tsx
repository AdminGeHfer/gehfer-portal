import * as React from "react";
import { Button } from "@/components/atoms/Button";
import { Form } from "@/components/ui/form";
import { RNC } from "@/types/rnc";
import { RNCBasicInfo } from "./form/RNCBasicInfo";
import { RNCCompanyInfo } from "./form/RNCCompanyInfo";
import { RNCContactInfo } from "./form/RNCContactInfo";
import { RNCOrderInfo } from "./form/RNCOrderInfo";
import { RNCFileUpload } from "./form/RNCFileUpload";
import { RNCAttachments } from "./RNCAttachments";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRNCForm } from "./hooks/useRNCForm";
import { toast } from "sonner";

interface RNCDetailFormProps {
  rnc: RNC;
  isEditing: boolean;
  onFieldChange: (field: keyof RNC, value: any) => void;
  onSave: () => Promise<void>;
}

export function RNCDetailForm({ 
  rnc, 
  isEditing, 
  onFieldChange,
  onSave 
}: RNCDetailFormProps) {
  const [activeTab, setActiveTab] = useState("company");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useRNCForm(rnc);

  const handleSubmit = async (data: any) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // Update all form fields
      Object.keys(data).forEach((key) => {
        onFieldChange(key as keyof RNC, data[key]);
      });

      // Call parent save handler
      await onSave();
      
      toast.success("RNC atualizada com sucesso");
      setActiveTab("company"); // Reset to first tab after successful save
    } catch (error) {
      toast.error("Erro ao atualizar RNC");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="company">Empresa</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="order">Pedido</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <TabsContent value="company" className="space-y-6">
              <div className="grid gap-6">
                <RNCCompanyInfo form={form} isEditing={isEditing} />
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <div className="grid gap-6">
                <RNCBasicInfo form={form} isEditing={isEditing} />
                {isEditing && <RNCFileUpload form={form} />}
                <RNCAttachments rncId={rnc.id} canEdit={isEditing} />
              </div>
            </TabsContent>

            <TabsContent value="order" className="space-y-6">
              <div className="grid gap-6">
                <RNCOrderInfo form={form} isEditing={isEditing} />
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <div className="grid gap-6">
                <RNCContactInfo form={form} isEditing={isEditing} />
              </div>
            </TabsContent>

            {isEditing && (
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (activeTab === "details") setActiveTab("company");
                    if (activeTab === "order") setActiveTab("details");
                    if (activeTab === "contact") setActiveTab("order");
                  }}
                  className="w-32"
                  disabled={activeTab === "company" || isSubmitting}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                {activeTab !== "contact" ? (
                  <Button
                    type="button"
                    onClick={() => {
                      if (activeTab === "company") setActiveTab("details");
                      if (activeTab === "details") setActiveTab("order");
                      if (activeTab === "order") setActiveTab("contact");
                    }}
                    className="w-32"
                    disabled={isSubmitting}
                  >
                    Próximo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    className="w-32"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Salvando..." : "Salvar"}
                  </Button>
                )}
              </div>
            )}
          </form>
        </Form>
      </Tabs>
    </div>
  );
}