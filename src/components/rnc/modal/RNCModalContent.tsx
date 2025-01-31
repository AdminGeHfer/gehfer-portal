import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoTab } from "../tabs/BasicInfoTab";
import { AdditionalInfoTab } from "../tabs/AdditionalInfoTab";
import { ProductsTab } from "../tabs/ProductsTab";
import { ContactTab } from "../tabs/ContactTab";
import { AttachmentsTab } from "../tabs/AttachmentsTab";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { toast } from "sonner";
import { type Path, useFormContext } from "react-hook-form";
import { type CreateRNCFormData } from "@/schemas/rncValidation";

interface RNCModalContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSave: (data) => Promise<void>;
  isSubmitting: boolean;
}

export const RNCModalContent = ({
  activeTab,
  setActiveTab,
  onSave,
  isSubmitting
}: RNCModalContentProps) => {
  const methods = useFormContext<CreateRNCFormData>();
  const tabs = ["basic", "additional", "products", "contact", "attachments"];

  const handleTabChange = async (value: string) => {
    try {
      if (tabs.indexOf(value) > tabs.indexOf(activeTab)) {
        let fieldsToValidate: Path<CreateRNCFormData>[] = [];
        switch (activeTab) {
          case "basic":
            fieldsToValidate = ["company_code", "company", "document", "type", "department", "responsible"];
            break;
          case "additional":
            fieldsToValidate = ["description", "korp", "nfv"];
            break;
          case "products":
            fieldsToValidate = ["products"];
            break;
          case "contact":
            fieldsToValidate = ["contacts"];
            break;
        }

        const isValid = await methods.trigger(fieldsToValidate);
        if (!isValid) {
          toast.error(`Por favor, preencha todos os campos obrigatórios na aba ${activeTab}`);
          return;
        }
      }
      setActiveTab(value);
    } catch (error) {
      console.error('Error changing tab:', error);
      toast.error('Erro ao mudar de aba');
    }
  };

  const handleSubmit = methods.handleSubmit((data) => {
    onSave(data);
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs value={activeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-blue-50 dark:bg-blue-900/50">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab}
              value={tab} 
              onClick={() => handleTabChange(tab)}
              className="cursor-pointer"
            >
              {tab === 'basic' && 'Inf. Básicas'}
              {tab === 'additional' && 'Inf. Compl.'}
              {tab === 'products' && 'Produtos'}
              {tab === 'contact' && 'Contato'}
              {tab === 'attachments' && 'Anexos'}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="block">
          {activeTab === 'basic' && <BasicInfoTab />}
          {activeTab === 'additional' && <AdditionalInfoTab />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'contact' && <ContactTab />}
          {activeTab === 'attachments' && <AttachmentsTab />}
        </div>
      </Tabs>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            const currentIndex = tabs.indexOf(activeTab);
            if (currentIndex > 0) {
              handleTabChange(tabs[currentIndex - 1]);
            }
          }}
          disabled={activeTab === tabs[0]}
          className="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        {activeTab === tabs[tabs.length - 1] ? (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              const currentIndex = tabs.indexOf(activeTab);
              if (currentIndex < tabs.length - 1) {
                handleTabChange(tabs[currentIndex + 1]);
              }
            }}
            className="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/50"
          >
            Próximo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
};
