import { RNC } from "@/types/rnc";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RNCReportProps {
  rnc: RNC;
  workflowHistory: any[];
}

export const RNCReport = ({ rnc, workflowHistory }: RNCReportProps) => {
  return (
    <div className="bg-white p-8 max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <div className="border-b pb-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Relatório RNC #{rnc.rnc_number}</h1>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              Data de Criação: {format(new Date(rnc.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
            </p>
            {rnc.closed_at && (
              <p className="text-sm text-gray-600">
                Data de Fechamento: {format(new Date(rnc.closed_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Informações Principais */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Informações Gerais</h2>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-600">Tipo</dt>
              <dd>{rnc.type === 'client' ? 'Cliente' : 'Fornecedor'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Prioridade</dt>
              <dd className="capitalize">{rnc.priority}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Departamento</dt>
              <dd>{rnc.department}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Informações da Empresa</h2>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-600">Empresa</dt>
              <dd>{rnc.company}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">CNPJ</dt>
              <dd>{rnc.cnpj}</dd>
            </div>
            {rnc.order_number && (
              <div>
                <dt className="text-sm font-medium text-gray-600">Número do Pedido</dt>
                <dd>{rnc.order_number}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Descrição */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Descrição</h2>
        <p className="text-gray-800 whitespace-pre-wrap">{rnc.description}</p>
      </div>

      {/* Histórico do Workflow */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Histórico de Status</h2>
        <div className="space-y-4">
          {workflowHistory.map((event, index) => (
            <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
              <div className="flex-1">
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-gray-600">
                  {format(new Date(event.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </p>
                {event.description && (
                  <p className="text-sm text-gray-700 mt-1">{event.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};