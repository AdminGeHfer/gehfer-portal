import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RNC } from "@/types/rnc";
import { FormEvent } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RNCDetailFormProps {
  rnc: RNC;
  isEditing: boolean;
  onChange: (field: keyof RNC, value: any) => void;
}

export const RNCDetailForm = ({ rnc, isEditing, onChange }: RNCDetailFormProps) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  const renderField = (label: string, value: string, field: keyof RNC) => {
    return (
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        {isEditing ? (
          <Input
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            className="mt-1"
          />
        ) : (
          <p className="dark:text-gray-200">{value}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Dados da Empresa</h2>
            <div className="grid grid-cols-2 gap-4">
              {renderField("Razão Social", rnc.company, "company")}
              {renderField("CNPJ", rnc.cnpj, "cnpj")}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Dados</h2>
            <div className="grid grid-cols-2 gap-4">
              {renderField("Nº do Pedido", rnc.orderNumber || "", "orderNumber")}
              {renderField("Nº da Devolução", rnc.returnNumber || "", "returnNumber")}
              {renderField("Departamento", rnc.department, "department")}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                {isEditing ? (
                  <Select
                    value={rnc.status}
                    onValueChange={(value) => onChange("status", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Aberto</SelectItem>
                      <SelectItem value="in_progress">Em Andamento</SelectItem>
                      <SelectItem value="closed">Fechado</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="dark:text-gray-200">
                    {rnc.status === "open"
                      ? "Aberto"
                      : rnc.status === "in_progress"
                      ? "Em Andamento"
                      : "Fechado"}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Descrição</h2>
            {isEditing ? (
              <Textarea
                value={rnc.description}
                onChange={(e) => onChange("description", e.target.value)}
                className="min-h-[100px]"
              />
            ) : (
              <p className="dark:text-gray-200">{rnc.description}</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700 h-fit">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Contato</h2>
          <div className="space-y-4">
            {renderField("Nome", rnc.contact.name, "contact")}
            {renderField("Telefone", rnc.contact.phone, "contact")}
            {renderField("Email", rnc.contact.email, "contact")}
          </div>
        </div>
      </div>
    </form>
  );
};