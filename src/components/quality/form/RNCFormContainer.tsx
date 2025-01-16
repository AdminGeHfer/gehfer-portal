import { useState } from "react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RNCFormData } from "@/types/rnc";
import { formSchema, defaultValues } from "./RNCFormConfig";
import { RNCFormTabs } from "./RNCFormTabs";
import { RNCFormNavigation } from "./RNCFormNavigation";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

interface RNCFormProps {
  initialData?: Partial<RNCFormData>;
  onSubmit: (data: RNCFormData) => Promise<string>;
  mode?: "create" | "edit";
}

export function RNCFormContainer({ initialData}: RNCFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("company");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  
  const form = useForm<RNCFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      ...initialData,
    },
    mode: "onSubmit"
  });

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setShowValidationErrors(true);
      
      toast({
        title: "RNC criada com sucesso",
        description: "A RNC foi registrada no sistema.",
      });
    } catch (error) {
      console.error('Error in RNC submission:', error);
      toast({
        title: "Erro ao processar RNC",
        description: "Ocorreu um erro ao tentar processar a RNC.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setShowValidationErrors(false);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <RNCFormTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            form={form}
            showValidationErrors={showValidationErrors}
          />
          <RNCFormNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isSubmitting={isSubmitting}
          />
        </form>
      </Form>
    </div>
  );
}