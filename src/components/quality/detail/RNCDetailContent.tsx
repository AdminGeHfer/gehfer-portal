import { RNC } from "@/types/rnc";
import { RNCDetailForm } from "./RNCDetailForm";

interface RNCDetailContentProps {
  rnc: RNC;
  isEditing: boolean;
  onRefresh: () => Promise<void>;
  onStatusChange: (status: string) => Promise<void>;
  onFieldChange: (field: keyof RNC, value: any) => void;
}

export function RNCDetailContent({
  rnc,
  isEditing,
  onRefresh,
  onStatusChange,
  onFieldChange,
}: RNCDetailContentProps) {
  return (
    <div className="space-y-6">
      <RNCDetailForm
        rnc={rnc}
        isEditing={isEditing}
        onFieldChange={onFieldChange}
      />
    </div>
  );
}