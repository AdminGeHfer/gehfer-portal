import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoTab, BasicInfoTabRef } from "../tabs/BasicInfoTab";
import { AdditionalInfoTab, AdditionalInfoTabRef } from "../tabs/AdditionalInfoTab";
import { ProductsTab, ProductsTabRef } from "../tabs/ProductsTab";
import { ContactTab, ContactTabRef } from "../tabs/ContactTab";
import { AttachmentsTab, AttachmentsTabRef } from "../tabs/AttachmentsTab";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { toast } from "sonner";

interface RNCModalContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onBack: () => void;
  onNext: () => void;
  onSave: () => void;
  setProgress: (progress: number) => void;
  progress?: number;
  refs: {
    basicInfoRef: React.RefObject<BasicInfoTabRef>;
    additionalInfoRef: React.RefObject<AdditionalInfoTabRef>;
    productsRef: React.RefObject<ProductsTabRef>;
    contactRef: React.RefObject<ContactTabRef>;
    attachmentsRef: React.RefObject<AttachmentsTabRef>;
  };
}

export const RNCModalContent = ({
  activeTab,
  setActiveTab,
  onBack,
  onNext,
  onSave,
  setProgress,
  refs,
}: RNCModalContentProps) => {
  const tabs = ["basic", "additional", "products", "contact", "attachments"];

  const handleTabChange = async (value: string) => {
    try {
      console.log(`Attempting to change tab from ${activeTab} to ${value}`);
      const isValid = await validateCurrentTab();
      if (!isValid) {
        toast.error(`Por favor, preencha todos os campos obrigatórios na aba ${activeTab}`);
        return;
      }
      setActiveTab(value);
    } catch (error) {
      console.error('Error changing tab:', error);
      toast.error('Erro ao mudar de aba');
    }
  };

  const validateCurrentTab = async () => {
    try {
      let currentRef;
      switch (activeTab) {
        case 'basic':
          currentRef = refs.basicInfoRef.current;
          break;
        case 'additional':
          currentRef = refs.additionalInfoRef.current;
          break;
        case 'products':
          currentRef = refs.productsRef.current;
          break;
        case 'contact':
          currentRef = refs.contactRef.current;
          break;
        case 'attachments':
          return true; // Attachments are optional
      }
  
      if (!currentRef?.validate) {
        console.log(`No validation method found for tab: ${activeTab}`);
        return false;
      }
      
      const isValid = await currentRef.validate();
      console.log(`Validation result for ${activeTab}:`, isValid);
      return isValid;
    } catch (error) {
      console.error(`Error validating ${activeTab} tab:`, error);
      return false;
    }
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-blue-50 dark:bg-blue-900/50">
          <TabsTrigger value="basic" className="cursor-default">Inf. Básicas</TabsTrigger>
          <TabsTrigger value="additional" className="cursor-default">Inf. Compl.</TabsTrigger>
          <TabsTrigger value="products" className="cursor-default">Produtos</TabsTrigger>
          <TabsTrigger value="contact" className="cursor-default">Contato</TabsTrigger>
          <TabsTrigger value="attachments" className="cursor-default">Anexos</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <BasicInfoTab setProgress={setProgress} ref={refs.basicInfoRef} />
        </TabsContent>

        <TabsContent value="additional">
          <AdditionalInfoTab setProgress={setProgress} ref={refs.additionalInfoRef} />
        </TabsContent>

        <TabsContent value="products">
          <ProductsTab setProgress={setProgress} ref={refs.productsRef} />
        </TabsContent>

        <TabsContent value="contact">
          <ContactTab setProgress={setProgress} ref={refs.contactRef} />
        </TabsContent>

        <TabsContent value="attachments">
          <AttachmentsTab setProgress={setProgress} ref={refs.attachmentsRef} />
        </TabsContent>
      </Tabs>

      <div className="space-y-4">
        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            disabled={activeTab === tabs[0]}
            className="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          {activeTab === tabs[tabs.length - 1] ? (
            <Button
              onClick={onSave}
              className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <Save className="mr-2 h-4 w-4" />
              Salvar
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={onNext}
              className="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/50"
            >
              Próximo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <p className="text-sm text-blue-600 dark:text-blue-400">* Campos obrigatórios</p>
      </div>
    </>
  );
};