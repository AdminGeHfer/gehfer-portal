import { RNC, WorkflowStatusEnum } from "@/types/rnc";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getStatusLabel } from "@/types/workflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import html2pdf from 'html2pdf.js';

interface RNCReportProps {
  rnc: RNC;
  onGeneratePDF?: () => void;
}

export function RNCReport({ rnc, onGeneratePDF }: RNCReportProps) {
  const formatDate = (date: string) => {
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
      locale: ptBR,
    });
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
      <div className="flex justify-between items-start border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">RNC #{rnc.rnc_number}</h1>
          <p className="text-sm text-gray-500">{formatDate(rnc.created_at)}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold">GeHfer</h2>
          <p className="text-sm text-gray-500">Sistema de Gestão da Qualidade</p>
        </div>
      </div>

      {/* Status e Prioridade */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white/50 backdrop-blur-sm border border-gray-100">
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
        <Card className="bg-white/50 backdrop-blur-sm border border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Prioridade</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{getPriorityLabel(rnc.priority)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Dados da Empresa */}
      <Card className="bg-white/50 backdrop-blur-sm border border-gray-100">
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
      <Card className="bg-white/50 backdrop-blur-sm border border-gray-100">
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
      <Card className="bg-white/50 backdrop-blur-sm border border-gray-100">
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
      <Card className="bg-white/50 backdrop-blur-sm border border-gray-100">
        <CardHeader>
          <CardTitle>Histórico do Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rnc.timeline
              .filter(event => event.type === 'status')
              .map((event, index) => (
                <div key={event.id} className="flex flex-col p-4 rounded-lg bg-muted/30 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-lg">{event.title}</p>
                    <time className="text-sm text-muted-foreground">
                      {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </time>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  {event.comment && (
                    <div className="mt-2 p-3 bg-white/50 rounded-md border border-gray-100">
                      <p className="text-sm italic">"{event.comment}"</p>
                    </div>
                  )}
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