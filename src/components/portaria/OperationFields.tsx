import * as React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MileageFields } from "./MileageFields";

interface OperationFieldsProps {
  register;
  setValue;
  watch;
  showMileageFields: boolean;
  initialKmPhoto: File | null;
  finalKmPhoto: File | null;
  onInitialPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFinalPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInitialPhotoRemove: () => void;
  onFinalPhotoRemove: () => void;
}

export function OperationFields({
  register,
  setValue,
  watch,
  showMileageFields,
  initialKmPhoto,
  finalKmPhoto,
  onInitialPhotoChange,
  onFinalPhotoChange,
  onInitialPhotoRemove,
  onFinalPhotoRemove
}: OperationFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="operation_type">Tipo de Operação</Label>
          <Select
            onValueChange={(value) => setValue("operation_type", value)}
            defaultValue={watch("operation_type")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de operação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="loading">Carga</SelectItem>
              <SelectItem value="unloading">Descarga</SelectItem>
              <SelectItem value="both">Carga/Descarga</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {showMileageFields && (
        <MileageFields
          register={register}
          initialKmPhoto={initialKmPhoto}
          finalKmPhoto={finalKmPhoto}
          onInitialPhotoChange={onInitialPhotoChange}
          onFinalPhotoChange={onFinalPhotoChange}
          onInitialPhotoRemove={onInitialPhotoRemove}
          onFinalPhotoRemove={onFinalPhotoRemove}
        />
      )}

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          placeholder="Observações adicionais"
          {...register("notes")}
        />
      </div>
    </div>
  );
}