import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoTab } from "../tabs/BasicInfoTab";
import { AdditionalInfoTab } from "../tabs/AdditionalInfoTab";
import { ProductsTab } from "../tabs/ProductsTab";
import { ContactTab } from "../tabs/ContactTab";
import { AttachmentsTab } from "../tabs/AttachmentsTab";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface RNCModalContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  progress: number;
  onBack: () => void;
  onNext: () => void;
  onSave: () => void;
  setProgress: (progress: number) => void;
}

export const RNCModalContent = ({
  activeTab,
  setActiveTab,
  progress,
  onBack,
  onNext,
  onSave,
  setProgress,
}: RNCModalContentProps) => {
  const tabs = ["basic", "additional", "products", "contact", "attachments"];

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-blue-50 dark:bg-blue-900/50">
          <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
          <TabsTrigger value="additional">Informações Complementares</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
          <TabsTrigger value="attachments">Anexos</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <BasicInfoTab setProgress={setProgress} />
        </TabsContent>

        <TabsContent value="additional">
          <AdditionalInfoTab setProgress={setProgress} />
        </TabsContent>

        <TabsContent value="products">
          <ProductsTab setProgress={setProgress} />
        </TabsContent>

        <TabsContent value="contact">
          <ContactTab setProgress={setProgress} />
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
              onClick={onNext}
              className="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/50"
            >
              Próximo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <p className="text-sm text-blue-600 dark:text-blue-400">* Campos obrigatórios</p>
        <Progress value={progress} className="h-2 bg-blue-100 dark:bg-blue-900" />
      </div>
    </>
  );
};