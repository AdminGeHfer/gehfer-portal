import { RNC, WorkflowStatusEnum, DepartmentEnum } from "@/types/rnc";

export interface RNCDetailProps {
  id: string;
}

export interface RNCFormData {
  description: string;
  priority: "low" | "medium" | "high";
  type: "client" | "supplier";
  department: DepartmentEnum;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  company: string;
  cnpj: string;
  order_number?: string;
  return_number?: string;
  workflow_status: WorkflowStatusEnum;
  assignedTo?: string;
  attachments?: File[];
  resolution?: string;
}

export interface RNCDetailHeaderProps {
  rnc: RNC;
  isEditing: boolean;
  canEdit: boolean;
  onEdit: () => void;
  onSave: () => Promise<void>;
  onDelete: () => void;
  onGeneratePDF: () => void;
  onWhatsApp: () => void;
  onStatusChange: (status: WorkflowStatusEnum) => Promise<void>;
  onRefresh: () => Promise<void>;
  setIsDeleteDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  isDeleting: boolean;
}

export interface RNCDetailContentProps {
  rnc: RNC;
  isEditing: boolean;
  onRefresh: () => Promise<void>;
  onStatusChange: (status: WorkflowStatusEnum) => Promise<void>;
  onFieldChange: (field: keyof RNC, value: any) => void;
}

export interface RNCDetailActionsProps {
  rnc: RNC;
  isEditing: boolean;
  canEdit: boolean;
  onEdit: () => void;
  onSave: () => Promise<void>;
  onDelete: () => void;
  onPrint: () => void;
  onWhatsApp: () => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  isDeleting: boolean;
}