import { RNC, WorkflowStatusEnum } from "@/types/rnc";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getStatusLabel } from "@/types/workflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface RNCReportProps {
  rnc: RNC;
}

export function RNCReport({ rnc }: RNCReportProps) {
  const formatDate = (date: string) => {
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
      locale: ptBR,
    });
  };

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

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-8 bg-white shadow-lg rounded-lg print:shadow-none print:p-0">
      {/* Cabeçalho */}
      <Card className="border-none shadow-none">
        <CardContent className="flex justify-between items-start pt-6">
          <div>
            <h1 className="text-2xl font-bold">RNC #{rnc.rnc_number}</h1>
            <p className="text-sm text-gray-500">{formatDate(rnc.created_at)}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-semibold">GeHfer</h2>
            <p className="text-sm text-gray-500">Sistema de Gestão da Qualidade</p>
          </div>
        </CardContent>
      </Card>

      {/* Status e Prioridade */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Status do Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{getStatusLabel(rnc.workflow_status)}</p>
            {rnc.assignedTo && (
              <p className="text-sm text-muted-foreground mt-1">
                Atribuído para: {rnc.assignedTo}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Prioridade</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{getPriorityLabel(rnc.priority)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Dados da Empresa */}
      <Card>
        <CardHeader>
          <CardTitle>Dados da Empresa</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Razão Social</p>
            <p className="font-medium">{rnc.company}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">CNPJ</p>
            <p className="font-medium">{rnc.cnpj}</p>
          </div>
          {rnc.orderNumber && (
            <div>
              <p className="text-sm text-gray-500">Nº do Pedido</p>
              <p className="font-medium">{rnc.orderNumber}</p>
            </div>
          )}
          {rnc.returnNumber && (
            <div>
              <p className="text-sm text-gray-500">Nº da Devolução</p>
              <p className="font-medium">{rnc.returnNumber}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detalhes da Não Conformidade */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Não Conformidade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Tipo</p>
              <p className="font-medium">{rnc.type === 'client' ? 'Cliente' : 'Fornecedor'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Departamento</p>
              <p className="font-medium">{rnc.department}</p>
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-sm text-gray-500 mb-2">Descrição</p>
            <p className="whitespace-pre-wrap">{rnc.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Contato */}
      <Card>
        <CardHeader>
          <CardTitle>Informações de Contato</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Nome</p>
            <p className="font-medium">{rnc.contact.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Telefone</p>
            <p className="font-medium">{rnc.contact.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{rnc.contact.email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Histórico do Workflow */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico do Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rnc.timeline
              .filter(event => event.type === 'status')
              .map((event, index) => (
                <div key={event.id} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="min-w-[120px]">
                    <time className="text-sm text-muted-foreground">
                      {format(new Date(event.date), "dd/MM/yyyy", { locale: ptBR })}
                    </time>
                  </div>
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    {event.comment && (
                      <p className="text-sm bg-muted p-2 rounded mt-2">{event.comment}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Rodapé */}
      <div className="text-xs text-gray-500 pt-4 border-t">
        <p>Documento gerado em {format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}</p>
      </div>
    </div>
  );
}