import React from "react";
import { RNC, WorkflowStatusEnum } from "@/types/rnc";
import { format } from "date-fns";

interface RNCPrintLayoutProps {
  rnc: RNC;
}

export function RNCPrintLayout({ rnc }: RNCPrintLayoutProps) {

  const comments = rnc.timeline
    .filter(event => event.type === 'comment')
    .map(event => ({
      ...event,
      date: format(new Date(event.date), "dd/MM/yyyy 'às' HH:mm")
    }));

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

  return (
    <div className="print-content p-6 max-w-[210mm] mx-auto bg-white">
      <div className="grid grid-cols-[2fr,1fr] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-4">
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

          {/* Company Section */}
          <section className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900 border-b pb-1">
              Dados da Empresa
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
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
          <section className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900 border-b pb-1">
              Detalhes da Não Conformidade
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
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
            </div>
            <div>
              <p className="font-medium text-gray-500">Descrição</p>
              <p>{rnc.description}</p>
            </div>
          </section>

          {/* Comments Section */}
          {comments.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-base font-semibold text-gray-900 border-b pb-1">
                Comentários
              </h3>
              <div className="space-y-4">
                {comments.map((comment, index) => (
                  <div key={index} className="text-sm">
                    <p className="text-gray-500">{comment.date}</p>
                    <p className="mt-1">{comment.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Contact Section */}
          <section className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900 border-b pb-1">
              Informações de Contato
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
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
        <div className="border-l pl-4">
          <h3 className="text-base font-semibold text-gray-900 border-b pb-1 mb-4">
            Linha do Tempo
          </h3>
          <div className="space-y-4">
            {rnc.timeline.map((event, index) => (
              <div key={index} className="relative pl-4 pb-4 text-sm">
                <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-gray-400" />
                {index !== rnc.timeline.length - 1 && (
                  <div className="absolute left-1 top-3 w-px h-full bg-gray-200" />
                )}
                <div>
                  <p className="font-medium">{event.title}</p>
                  <time className="text-xs text-gray-500">{event.date}</time>
                  <p className="text-gray-600 mt-1">{event.description}</p>
                  {event.comment && (
                    <p className="text-gray-600 mt-1 italic">&quot;{event.comment}&quot;</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t text-xs text-gray-500">
        <p>Documento gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm")}</p>
      </div>
    </div>
  );
}
