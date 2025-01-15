import * as React from "react";
import { Button } from "@/components/atoms/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface RNCFormNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSubmitting: boolean;
}

export function RNCFormNavigation({ activeTab, setActiveTab, isSubmitting }: RNCFormNavigationProps) {
  return (
    <div className="flex justify-end gap-4 pt-6 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          if (activeTab === "details") setActiveTab("company");
          if (activeTab === "contact") setActiveTab("details");
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
            if (activeTab === "details") setActiveTab("contact");
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
          {isSubmitting ? "Enviando..." : "Finalizar"}
        </Button>
      )}
    </div>
  );
}