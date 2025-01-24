import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdditionalInfoTabProps {
  isEditing: boolean;
}

export function AdditionalInfoTab({ isEditing }: AdditionalInfoTabProps) {
  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="description">
          Descrição <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          disabled={!isEditing}
          className="min-h-[100px] border-blue-200 focus:border-blue-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="korp">
            Número do pedido (KORP) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="korp"
            disabled={!isEditing}
            className="border-blue-200 focus:border-blue-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nfv">
            NFV <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="nfv"
            disabled={!isEditing}
            className="border-blue-200 focus:border-blue-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nfd">NFD</Label>
          <Input
            id="nfd"
            disabled={!isEditing}
            className="border-blue-200 focus:border-blue-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">
            Cidade <span className="text-red-500">*</span>
          </Label>
          <Input
            id="city"
            disabled={!isEditing}
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="conclusion">
          Conclusão Final <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="conclusion"
          disabled={!isEditing}
          className="min-h-[100px] border-blue-200 focus:border-blue-400"
        />
      </div>
    </div>
  );
}