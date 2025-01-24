import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BasicInfoTabProps {
  isEditing: boolean;
}

export function BasicInfoTab({ isEditing }: BasicInfoTabProps) {
  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyCode">
            Código da empresa <span className="text-red-500">*</span>
          </Label>
          <Input
            id="companyCode"
            disabled={!isEditing}
            className="border-blue-200 focus:border-blue-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">
            Empresa <span className="text-red-500">*</span>
          </Label>
          <Input
            id="company"
            disabled={!isEditing}
            className="border-blue-200 focus:border-blue-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="document">
            Documento <span className="text-red-500">*</span>
          </Label>
          <Input
            id="document"
            disabled={!isEditing}
            className="border-blue-200 focus:border-blue-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">
            Tipo <span className="text-red-500">*</span>
          </Label>
          <Select disabled={!isEditing}>
            <SelectTrigger className="border-blue-200 focus:border-blue-400">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="company_complaint">Reclamação do Cliente</SelectItem>
              <SelectItem value="supplier">Fornecedor</SelectItem>
              <SelectItem value="dispatch">Expedição</SelectItem>
              <SelectItem value="logistics">Logística</SelectItem>
              <SelectItem value="deputy">Representante</SelectItem>
              <SelectItem value="driver">Motorista</SelectItem>
              <SelectItem value="financial">Financeiro</SelectItem>
              <SelectItem value="commercial">Comercial</SelectItem>
              <SelectItem value="financial_agreement">Acordo Financeiro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">
            Departamento <span className="text-red-500">*</span>
          </Label>
          <Select disabled={!isEditing}>
            <SelectTrigger className="border-blue-200 focus:border-blue-400">
              <SelectValue placeholder="Selecione o departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="logistics">Logística</SelectItem>
              <SelectItem value="quality">Qualidade</SelectItem>
              <SelectItem value="financial">Financeiro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="responsible">
            Responsável <span className="text-red-500">*</span>
          </Label>
          <Select disabled={!isEditing}>
            <SelectTrigger className="border-blue-200 focus:border-blue-400">
              <SelectValue placeholder="Selecione o responsável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alexandre">Alexandre</SelectItem>
              <SelectItem value="arthur">Arthur</SelectItem>
              <SelectItem value="financeiro">Financeiro</SelectItem>
              <SelectItem value="giovani">Giovani</SelectItem>
              <SelectItem value="helcio">Helcio</SelectItem>
              <SelectItem value="izabelly">Izabelly</SelectItem>
              <SelectItem value="jordana">Jordana</SelectItem>
              <SelectItem value="marcos">Marcos</SelectItem>
              <SelectItem value="pedro">Pedro</SelectItem>
              <SelectItem value="samuel">Samuel</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}