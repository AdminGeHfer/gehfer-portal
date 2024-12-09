import { RNC } from "@/types/rnc";

interface RNCReportProps {
  rnc: RNC;
}

export function RNCReport({ rnc }: RNCReportProps) {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">RNC #{rnc.rnc_number}</h2>
          <p className="text-gray-500">Criada em {new Date(rnc.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Informações da Empresa</h3>
          <dl className="space-y-2">
            <div>
              <dt className="text-gray-500">Empresa</dt>
              <dd>{rnc.company}</dd>
            </div>
            <div>
              <dt className="text-gray-500">CNPJ</dt>
              <dd>{rnc.cnpj}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Nº do Pedido</dt>
              <dd>{rnc.order_number || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Nº da Devolução</dt>
              <dd>{rnc.return_number || "N/A"}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Contato</h3>
          <dl className="space-y-2">
            <div>
              <dt className="text-gray-500">Nome</dt>
              <dd>{rnc.contact.name}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Telefone</dt>
              <dd>{rnc.contact.phone}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Email</dt>
              <dd>{rnc.contact.email}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Descrição</h3>
        <p className="text-gray-700">{rnc.description}</p>
      </div>

      {rnc.resolution && (
        <div>
          <h3 className="font-semibold mb-2">Resolução</h3>
          <p className="text-gray-700">{rnc.resolution}</p>
        </div>
      )}
    </div>
  );
}