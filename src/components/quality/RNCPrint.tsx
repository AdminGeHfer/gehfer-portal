import * as React from "react";
import { RNC, WorkflowStatusEnum } from "@/types/rnc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface RNCPrintProps {
  rnc: RNC;
}

export function RNCPrint({ rnc }: RNCPrintProps) {
  const getStatusLabel = (status: WorkflowStatusEnum) => {
    const labels: Record<WorkflowStatusEnum, string> = {
      open: "Aberto",
      analysis: "Em Análise",
      resolution: "Em Resolução",
      closing: "Em Fechamento",
      closed: "Encerrado",
      solved: "Solucionado"
    };
    return labels[status];
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 print:p-0">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">RNC #{rnc.id}</h1>
          <p className="text-gray-500">{format(new Date(rnc.created_at), "dd/MM/yyyy HH:mm")}</p>
        </div>
        <div className="text-right">
          <h2 className="font-bold">GeHfer</h2>
          <p>Sistema de Gestão da Qualidade</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Empresa</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Código do Cliente</p>
            <p>{rnc.company_code}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Razão Social</p>
            <p>{rnc.company}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">CNPJ</p>
            <p>{rnc.cnpj}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da RNC</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Tipo</p>
              <p>{rnc.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p>{getStatusLabel(rnc.workflow_status)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Departamento</p>
              <p>{rnc.department}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Descrição</p>
            <p>{rnc.description}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Produto</p>
            <p>{rnc.product}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Nº do Pedido KORP</p>
            <p>{rnc.korp || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Nº da Nota de Venda</p>
            <p>{rnc.nfv || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Nº da Devolução</p>
            <p>{rnc.nfd || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Responsável</p>
            <p>{rnc.responsible}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Dias</p>
            <p>{rnc.days_left}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cidade</p>
            <p>{rnc.city}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Conclusão</p>
            <p>{rnc.conclusion}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações de Contato</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Nome</p>
            <p>{rnc.contact.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Telefone</p>
            <p>{rnc.contact.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p>{rnc.contact.email}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
