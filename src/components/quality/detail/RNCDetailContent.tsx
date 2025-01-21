import * as React from "react";
import { RNC } from "@/types/rnc";
import { RNCDetailForm } from "./RNCDetailForm";

interface RNCDetailContentProps {
  rnc: RNC;
  isEditing: boolean;
  onRefresh: () => Promise<void>;
  onStatusChange: (status: string) => Promise<void>;
  onFieldChange: (field: keyof RNC, value: any) => void;
  onSave: () => Promise<void>;
}

export function RNCDetailContent({
  rnc,
  isEditing,
  onFieldChange,
  onSave,
}: RNCDetailContentProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <RNCDetailForm
        rnc={rnc}
        isEditing={isEditing}
        onFieldChange={onFieldChange}
        onSave={onSave}
      />
    </div>
  );
}