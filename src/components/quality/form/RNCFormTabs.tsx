import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RNCBasicInfo } from "./RNCBasicInfo";
import { RNCCompanyInfo } from "./RNCCompanyInfo";
import { RNCContactInfo } from "./RNCContactInfo";
import { RNCFileUpload } from "./RNCFileUpload";
import { UseFormReturn } from "react-hook-form";
import { RNCFormData } from "@/types/rnc";

interface RNCFormTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  form: UseFormReturn<RNCFormData>;
  showValidationErrors: boolean;
}

export function RNCFormTabs({ activeTab, onTabChange, form, showValidationErrors }: RNCFormTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="company">Empresa</TabsTrigger>
        <TabsTrigger value="details">Detalhes</TabsTrigger>
        <TabsTrigger value="contact">Contato</TabsTrigger>
      </TabsList>

      <TabsContent value="company" className="space-y-6">
        <div className="grid gap-6">
          <RNCCompanyInfo form={form} showErrors={showValidationErrors} />
        </div>
      </TabsContent>

      <TabsContent value="details" className="space-y-6">
        <div className="grid gap-6">
          <RNCBasicInfo form={form} showErrors={showValidationErrors} />
          <RNCFileUpload form={form} showErrors={showValidationErrors} />
        </div>
      </TabsContent>

      <TabsContent value="contact" className="space-y-6">
        <div className="grid gap-6">
          <RNCContactInfo form={form} showErrors={showValidationErrors} />
        </div>
      </TabsContent>
    </Tabs>
  );
}