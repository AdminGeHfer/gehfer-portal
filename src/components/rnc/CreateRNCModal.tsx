import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { RNCModalContent } from "./modal/RNCModalContent";
import { useToast } from "@/hooks/use-toast";

interface CreateRNCModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateRNCModal({ open, onClose }: CreateRNCModalProps) {
  const [activeTab, setActiveTab] = React.useState("basic");
  const { toast } = useToast();
  const basicInfoRef = React.useRef<{ validate: () => Promise<boolean> }>(null);
  const additionalInfoRef = React.useRef<{ validate: () => Promise<boolean> }>(null);
  const productsRef = React.useRef<{ validate: () => Promise<boolean> }>(null);
  const contactRef = React.useRef<{ validate: () => Promise<boolean> }>(null);

  const handleBack = () => {
    const tabs = ["basic", "additional", "products", "contact", "attachments"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const validateCurrentTab = async (showErrors: boolean = false) => {
    switch (activeTab) {
      case "basic":
        return await basicInfoRef.current?.validate() ?? false;
      case "additional":
        return await additionalInfoRef.current?.validate() ?? false;
      case "products":
        return await productsRef.current?.validate() ?? false;
      case "contact":
        return await contactRef.current?.validate() ?? false;
      case "attachments":
        return true; // Attachments are optional
      default:
        return false;
    }
  };

  const handleNext = async () => {
    const tabs = ["basic", "additional", "products", "contact", "attachments"];
    const currentIndex = tabs.indexOf(activeTab);
    
    // Validate current tab before moving to next, but don't show errors
    const isValid = await validateCurrentTab(false);
    if (!isValid) {
      // Silently prevent navigation if invalid
      return;
    }

    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handleSave = async () => {
    // Validate all tabs before saving and show errors
    const isBasicValid = await basicInfoRef.current?.validate() ?? false;
    const isAdditionalValid = await additionalInfoRef.current?.validate() ?? false;
    const isProductsValid = await productsRef.current?.validate() ?? false;
    const isContactValid = await contactRef.current?.validate() ?? false;

    if (!isBasicValid || !isAdditionalValid || !isProductsValid || !isContactValid) {
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description: "Por favor, verifique se todos os campos obrigatórios foram preenchidos corretamente.",
      });
      return;
    }

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-gray-900">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-blue-100 pb-4 dark:border-blue-900">
          <div className="flex-1 text-center">
            <DialogTitle className="text-xl font-semibold text-blue-900 dark:text-blue-100">
              Criar RNC
            </DialogTitle>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <RNCModalContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onBack={handleBack}
          onNext={handleNext}
          onSave={handleSave}
          setProgress={() => {}}
          refs={{
            basicInfoRef,
            additionalInfoRef,
            productsRef,
            contactRef
          }}
        />
      </DialogContent>
    </Dialog>
  );
}