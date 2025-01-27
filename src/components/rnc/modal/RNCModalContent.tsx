import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoTab } from "../tabs/BasicInfoTab";
import { AdditionalInfoTab } from "../tabs/AdditionalInfoTab";
import { ProductsTab } from "../tabs/ProductsTab";
import { ContactTab } from "../tabs/ContactTab";
import { AttachmentsTab } from "../tabs/AttachmentsTab";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";

interface RNCModalContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onBack: () => void;
  onNext: () => void;
  onSave: () => void;
  setProgress: (progress: number) => void;
  progress?: number;
  refs?: {
    basicInfoRef: React.RefObject<{ validate: () => Promise<boolean>; setFormData: (data) => void }>;
    additionalInfoRef: React.RefObject<{ validate: () => Promise<boolean>; setFormData: (data) => void }>;
    productsRef: React.RefObject<{ validate: () => Promise<boolean>; setFormData: (data) => void }>;
    contactRef: React.RefObject<{ validate: () => Promise<boolean>; setFormData: (data) => void }>;
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

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-blue-50 dark:bg-blue-900/50">
          <TabsTrigger value="basic">Inf. Básicas</TabsTrigger>
          <TabsTrigger value="additional">Inf. Compl.</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
          <TabsTrigger value="attachments">Anexos</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <BasicInfoTab setProgress={setProgress} ref={refs?.basicInfoRef} />
        </TabsContent>

        <TabsContent value="additional">
          <AdditionalInfoTab setProgress={setProgress} ref={refs?.additionalInfoRef} />
        </TabsContent>

        <TabsContent value="products">
          <ProductsTab setProgress={setProgress} ref={refs?.productsRef} />
        </TabsContent>

        <TabsContent value="contact">
          <ContactTab setProgress={setProgress} ref={refs?.contactRef} />
        </TabsContent>

        <TabsContent value="attachments">
          <AttachmentsTab setProgress={setProgress} />
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