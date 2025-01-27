import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { RNCModalContent } from "./modal/RNCModalContent";

interface CreateRNCModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateRNCModal({ open, onClose }: CreateRNCModalProps) {
  const [activeTab, setActiveTab] = React.useState("basic");
  const basicInfoRef = React.useRef<{ validate: () => Promise<boolean>; setFormData: (data) => void }>(null);
  const additionalInfoRef = React.useRef<{ validate: () => Promise<boolean>; setFormData: (data) => void }>(null);
  const productsRef = React.useRef<{ validate: () => Promise<boolean>; setFormData: (data) => void }>(null);
  const contactRef = React.useRef<{ validate: () => Promise<boolean>; setFormData: (data) => void }>(null);

  // Load saved form data when component mounts
  React.useEffect(() => {
    const savedData = localStorage.getItem('rncFormData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Pass the saved data to child components through refs
      if (basicInfoRef.current) {
        basicInfoRef.current.setFormData?.(parsedData.basic);
      }
      if (additionalInfoRef.current) {
        additionalInfoRef.current.setFormData?.(parsedData.additional);
      }
      if (productsRef.current) {
        productsRef.current.setFormData?.(parsedData.products);
      }
      if (contactRef.current) {
        contactRef.current.setFormData?.(parsedData.contact);
      }
    }
  }, []);

  const handleBack = () => {
    const tabs = ["basic", "additional", "products", "contact", "attachments"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const validateCurrentTab = async () => {
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
    
    // Validate current tab before moving to next
    const isValid = await validateCurrentTab();
    if (!isValid) {
      return;
    }

    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handleSave = async () => {
    // Only clear form data from localStorage on successful save
    localStorage.removeItem('rncFormData');
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