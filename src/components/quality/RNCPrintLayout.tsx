import { RNC } from "@/types/rnc";
import { format } from "date-fns";

interface RNCPrintLayoutProps {
  rnc: RNC;
}

export function RNCPrintLayout({ rnc }: RNCPrintLayoutProps) {
  return (
    <div className="print-content p-8 max-w-4xl mx-auto bg-white">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">RNC #{rnc.id}</h1>
          <p className="text-gray-500 mt-1">
            {format(new Date(rnc.createdAt), "dd/MM/yyyy HH:mm")}
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold text-gray-900">GeHfer</h2>
          <p className="text-gray-500">Sistema de Gestão da Qualidade</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-8">
        {/* Company Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Dados da Empresa
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Razão Social</p>
              <p className="mt-1">{rnc.company}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">CNPJ</p>
              <p className="mt-1">{rnc.cnpj}</p>
            </div>
          </div>
        </section>

        {/* RNC Details Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Detalhes da Não Conformidade
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Título</p>
              <p className="mt-1">{rnc.title}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tipo</p>
              <p className="mt-1 capitalize">{rnc.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Nº do Pedido</p>
              <p className="mt-1">{rnc.orderNumber || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Nº da Devolução</p>
              <p className="mt-1">{rnc.returnNumber || "N/A"}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500">Descrição</p>
            <p className="mt-1 whitespace-pre-wrap">{rnc.description}</p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Informações de Contato
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Contato</p>
              <p className="mt-1">{rnc.contact}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Departamento</p>
              <p className="mt-1">{rnc.department}</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t text-sm text-gray-500">
          <p>Documento gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm")}</p>
        </div>
      </div>
    </div>
  );
}