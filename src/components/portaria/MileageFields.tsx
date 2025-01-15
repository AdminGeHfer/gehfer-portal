import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUploadField } from "./FileUploadField";

interface MileageFieldsProps {
  register;
  initialKmPhoto: File | null;
  finalKmPhoto: File | null;
  onInitialPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFinalPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInitialPhotoRemove: () => void;
  onFinalPhotoRemove: () => void;
}

export function MileageFields({
  register,
  initialKmPhoto,
  finalKmPhoto,
  onInitialPhotoChange,
  onFinalPhotoChange,
  onInitialPhotoRemove,
  onFinalPhotoRemove
}: MileageFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="initialKm">Quilometragem Inicial</Label>
          <Input
            id="initialKm"
            type="number"
            placeholder="KM atual do veículo"
            {...register("initialKm")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="finalKm">Quilometragem Final</Label>
          <Input
            id="finalKm"
            type="number"
            placeholder="KM final do veículo"
            {...register("finalKm")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FileUploadField
          label="Foto KM Inicial"
          onChange={onInitialPhotoChange}
          value={initialKmPhoto}
          onRemove={onInitialPhotoRemove}
        />
        <FileUploadField
          label="Foto KM Final"
          onChange={onFinalPhotoChange}
          value={finalKmPhoto}
          onRemove={onFinalPhotoRemove}
        />
      </div>
    </div>
  );
}