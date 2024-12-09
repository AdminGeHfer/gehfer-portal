import { RNC, WorkflowStatusEnum } from "@/types/rnc";
import { format } from "date-fns";
import { FileIcon, ImageIcon } from "lucide-react";

interface RNCPrintLayoutProps {
  rnc: RNC;
}

export function RNCReport({ rnc }: RNCPrintLayoutProps) {
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return <ImageIcon className="h-4 w-4" />;
    }
    return <FileIcon className="h-4 w-4" />;
  };

  const comments = rnc.timeline
    ?.filter(event => event.type === 'comment')
    .map(event => ({
      ...event,
      date: format(new Date(event.date), "dd/MM/yyyy 'às' HH:mm")
    })) || [];

  const getStatusLabel = (status: WorkflowStatusEnum) => {
    const labels: Record<WorkflowStatusEnum, string> = {
      [WorkflowStatusEnum.OPEN]: "Aberto",
      [WorkflowStatusEnum.ANALYSIS]: "Em Análise",
      [WorkflowStatusEnum.RESOLUTION]: "Em Resolução",
      [WorkflowStatusEnum.SOLVED]: "Solucionado",
      [WorkflowStatusEnum.CLOSING]: "Em Fechamento",
      [WorkflowStatusEnum.CLOSED]: "Encerrado"
    };
    return labels[status];
  };

  return (
    <div className="print-content max-w-[210mm] mx-auto bg-white text-sm">
      <div className="grid grid-cols-[2fr,1fr] gap-4">
        {/* Main Content */}
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <h1 className="text-xl font-bold text-gray-900">RNC #{rnc.rnc_number}</h1>
              <p className="text-xs text-gray-500">
                {format(new Date(rnc.created_at), "dd/MM/yyyy HH:mm")}
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-semibold text-gray-900">GeHfer</h2>
              <p className="text-xs text-gray-500">Sistema de Gestão da Qualidade</p>
            </div>
          </div>

          {/* Company Section */}
          <section className="space-y-1">
            <h3 className="text-sm font-semibold text-gray-900 border-b pb-1">
              Dados da Empresa
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-medium text-gray-500">Razão Social</p>
                <p>{rnc.company}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">CNPJ</p>
                <p>{rnc.cnpj}</p>
              </div>
            </div>
          </section>

          {/* RNC Details Section */}
          <section className="space-y-1">
            <h3 className="text-sm font-semibold text-gray-900 border-b pb-1">
              Detalhes da Não Conformidade
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-medium text-gray-500">Tipo</p>
                <p>{rnc.type}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Nº do Pedido</p>
                <p>{rnc.order_number || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Nº da Devolução</p>
                <p>{rnc.return_number || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Status</p>
                <p>{getStatusLabel(rnc.workflow_status)}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Prioridade</p>
                <p>{rnc.priority}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Departamento</p>
                <p>{rnc.department}</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="font-medium text-gray-500">Descrição</p>
              <p className="whitespace-pre-wrap">{rnc.description}</p>
            </div>
          </section>

          {/* Comments Section */}
          {comments.length > 0 && (
            <section className="space-y-1">
              <h3 className="text-sm font-semibold text-gray-900 border-b pb-1">
                Comentários
              </h3>
              <div className="space-y-2">
                {comments.map((comment, index) => (
                  <div key={index} className="text-xs">
                    <p className="text-gray-500">{comment.date}</p>
                    <p className="mt-0.5">{comment.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Contact Section */}
          <section className="space-y-1">
            <h3 className="text-sm font-semibold text-gray-900 border-b pb-1">
              Informações de Contato
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-medium text-gray-500">Nome</p>
                <p>{rnc.contact.name}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Telefone</p>
                <p>{rnc.contact.phone}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Email</p>
                <p>{rnc.contact.email}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Departamento</p>
                <p>{rnc.department}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Timeline Section */}
        <div className="border-l pl-2">
          <h3 className="text-sm font-semibold text-gray-900 border-b pb-1 mb-2">
            Linha do Tempo
          </h3>
          <div className="space-y-2">
            {rnc.timeline.map((event, index) => (
              <div key={index} className="relative pl-3 pb-2 text-xs">
                <div className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-gray-400" />
                {index !== rnc.timeline.length - 1 && (
                  <div className="absolute left-0.5 top-3 w-px h-full bg-gray-200" />
                )}
                <div>
                  <p className="font-medium">{event.title}</p>
                  <time className="text-[10px] text-gray-500">{event.date}</time>
                  <p className="text-gray-600 mt-0.5">{event.description}</p>
                  {event.comment && (
                    <p className="text-gray-600 mt-0.5 italic text-[10px]">"{event.comment}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-2 border-t text-[10px] text-gray-500">
        <p>Documento gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm")}</p>
      </div>
    </div>
  );
}
