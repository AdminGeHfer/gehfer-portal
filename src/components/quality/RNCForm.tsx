import * as React from "react";
import { RNCFormContainer } from "./form/RNCFormContainer";
import { RNCFormData } from "@/types/rnc";

interface RNCFormProps {
  initialData?: Partial<RNCFormData>;
  onSubmit: (data: RNCFormData) => Promise<string>;
  mode?: "create" | "edit";
}

export function RNCForm(props: RNCFormProps) {
  return <RNCFormContainer {...props} />;
}