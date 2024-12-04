import { RNC } from "@/types/rnc";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getStatusLabel } from "@/types/workflow";

interface RNCReportProps {
  rnc: RNC;
}

export function RNCReport({ rnc }: RNCReportProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Relatório de Não Conformidade</h1>
        <p className="text-gray-600">RNC #{rnc.rnc_number}</p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Informações Gerais</h2>
          <dl className="grid grid-cols-1 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-600">Status</dt>
              <dd className="font-semibold">{getStatusLabel(rnc.workflow_status)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Prioridade</dt>
              <dd>{rnc.priority}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Tipo</dt>
              <dd>{rnc.type}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Departamento</dt>
              <dd>{rnc.department}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Dados da Empresa</h2>
          <dl className="grid grid-cols-1 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-600">Empresa</dt>
              <dd>{rnc.company}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">CNPJ</dt>
              <dd>{rnc.cnpj}</dd>
            </div>
            {rnc.orderNumber && (
              <div>
                <dt className="text-sm font-medium text-gray-600">Número do Pedido</dt>
                <dd>{rnc.orderNumber}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Descrição</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{rnc.description}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Contato</h2>
        <dl className="grid grid-cols-3 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-600">Nome</dt>
            <dd>{rnc.contact.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-600">Telefone</dt>
            <dd>{rnc.contact.phone}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-600">Email</dt>
            <dd>{rnc.contact.email}</dd>
          </div>
        </dl>
      </div>

      <div className="text-sm text-gray-500 mt-8 pt-4 border-t">
        <p>
          Criado em:{" "}
          {format(new Date(rnc.created_at), "dd/MM/yyyy 'às' HH:mm", {
            locale: ptBR,
          })}
        </p>
        {rnc.closed_at && (
          <p>
            Fechado em:{" "}
            {format(new Date(rnc.closed_at), "dd/MM/yyyy 'às' HH:mm", {
              locale: ptBR,
            })}
          </p>
        )}
      </div>
    </div>
  );
}