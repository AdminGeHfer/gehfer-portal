import * as React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RNCFormData } from "@/types/rnc";
import { OrderFields } from "./products/OrderFields";

interface RNCOrderInfoProps {
  form: UseFormReturn<RNCFormData>;
  isEditing: boolean;
}

export function RNCOrderInfo({ form, isEditing }: RNCOrderInfoProps) {
  return (
    <div className="space-y-6">
      <OrderFields form={form} canEdit={isEditing} />
    </div>
  );
}