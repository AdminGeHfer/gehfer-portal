import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RNC, WorkflowStatusEnum } from "@/types/rnc";
import { format } from "date-fns";
import { RNCTimeline } from "../RNCTimeline";

interface RNCReportProps {
  rnc: RNC;
}

export function RNCReport({ rnc }: RNCReportProps) {
  const getStatusLabel = (status: WorkflowStatusEnum) => {
    const labels: Record<WorkflowStatusEnum, string> = {
      open: "Aberto",
      analysis: "Em Análise",
      resolution: "Em Resolução",
      solved: "Solucionado",
      closing: "Em Fechamento",
      closed: "Encerrado"
    };
    return labels[status];
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      low: "Baixa",
      medium: "Média",
      high: "Alta"
    };
    return labels[priority] || priority;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      client: "Cliente",
      supplier: "Fornecedor"
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-4 p-8 bg-white text-black">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">RNC #{rnc.rnc_number}</h1>
          <p className="text-sm text-gray-500">
            {format(new Date(rnc.created_at), "dd/MM/yyyy HH:mm")}
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold text-gray-900">GeHfer</h2>
          <p className="text-sm text-gray-500">Sistema de Gestão da Qualidade</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Razão Social</h3>
              <p>{rnc.company}</p>
            </div>
            <div>
              <h3 className="font-semibold">CNPJ</h3>
              <p>{rnc.cnpj}</p>
            </div>
            <div>
              <h3 className="font-semibold">Nº do Pedido</h3>
              <p>{rnc.order_number || "N/A"}</p>
            </div>
            <div>
              <h3 className="font-semibold">Nº da Devolução</h3>
              <p>{rnc.return_number || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Não Conformidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-semibold">Status</h3>
              <p>{getStatusLabel(rnc.workflow_status)}</p>
            </div>
            <div>
              <h3 className="font-semibold">Prioridade</h3>
              <p>{getPriorityLabel(rnc.priority)}</p>
            </div>
            <div>
              <h3 className="font-semibold">Tipo</h3>
              <p>{getTypeLabel(rnc.type)}</p>
            </div>
            <div>
              <h3 className="font-semibold">Departamento</h3>
              <p>{rnc.department}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Descrição</h3>
            <p className="whitespace-pre-wrap">{rnc.description}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Contato</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Nome</h3>
              <p>{rnc.contact.name}</p>
            </div>
            <div>
              <h3 className="font-semibold">Email</h3>
              <p>{rnc.contact.email}</p>
            </div>
            <div>
              <h3 className="font-semibold">Telefone</h3>
              <p>{rnc.contact.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico do Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <RNCTimeline rncId={rnc.id} />
        </CardContent>
      </Card>

      <div className="text-xs text-gray-500 mt-8">
        <p>Documento gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm")}</p>
      </div>
    </div>
  );
}
