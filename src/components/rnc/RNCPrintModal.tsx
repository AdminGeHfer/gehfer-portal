import * as React from 'react';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { RNCWithRelations, RNCContact, RNCProduct, WorkflowTransition, RncTypeEnum, RncDepartmentEnum } from "@/types/rnc";
import { getDepartmentDisplayName, getStatusDisplayName, getTypeDisplayName, getWorkflowStatusDisplayName } from '@/pages/quality/home/utils/colors';

export interface BasicInfo {
  company: string;
  company_code: string;
  document: string;
  type: RncTypeEnum;
  department: RncDepartmentEnum;
  responsible: string;
}

export interface AdditionalInfo {
  description: string;
  korp: string;
  nfv: string;
  nfd: string;
  city: string;
  collected_at: Date | null;
  closed_at: Date | null;
  conclusion: string;
}

interface RelationalInfo {
  products: RNCProduct[];
  contacts: RNCContact[];
}

interface WorkflowInfo {
  transitions: WorkflowTransition[];
}

export interface RNCPrintContentProps {
  rnc: RNCWithRelations;
  basicInfo: BasicInfo;
  additionalInfo: AdditionalInfo;
  relationalInfo: RelationalInfo;
  workflowInfo: WorkflowInfo;
}

export function RNCPrintContent({
    rnc,
    basicInfo,
    additionalInfo,
    relationalInfo,
    workflowInfo
  }: RNCPrintContentProps) {
    return (
      <div className="print-content p-8 bg-white text-black">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 print-force-show">
        <h1 className="text-3xl font-bold text-black">RNC #{rnc.rnc_number}</h1>
        <div className="text-xl font-semibold text-black">{getStatusDisplayName(rnc.status)}</div>
      </div>

      {/* Basic Info Section */}
      <section className="mb-8 print-force-show">
        <h2 className="text-2xl font-bold mb-4 text-black">Informações Básicas</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-black">Empresa:</p>
            <p className="text-black">{basicInfo.company}</p>
          </div>
          <div>
            <p className="font-semibold text-black">Código:</p>
            <p className="text-black">{basicInfo.company_code}</p>
          </div>
          <div>
            <p className="font-semibold text-black">Documento:</p>
            <p className="text-black">{basicInfo.document}</p>
          </div>
          <div>
            <p className="font-semibold text-black">Tipo:</p>
            <p className="text-black">{getTypeDisplayName(basicInfo.type)}</p>
          </div>
          <div>
            <p className="font-semibold text-black">Departamento:</p>
            <p className="text-black">{getDepartmentDisplayName(basicInfo.department)}</p>
          </div>
          <div>
            <p className="font-semibold text-black">Responsável:</p>
            <p className="text-black">{basicInfo.responsible}</p>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="mb-8 print-force-show">
        <h2 className="text-2xl font-bold mb-4 text-black">Informações Adicionais</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-black">Descrição:</p>
            <p className="text-black">{additionalInfo.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-black">KORP:</p>
              <p className="text-black">{additionalInfo.korp}</p>
            </div>
            <div>
              <p className="font-semibold text-black">NFV:</p>
              <p className="text-black">{additionalInfo.nfv}</p>
            </div>
            <div>
              <p className="font-semibold text-black">NFD:</p>
              <p className="text-black">{additionalInfo.nfd}</p>
            </div>
            <div>
              <p className="font-semibold text-black">Cidade:</p>
              <p className="text-black">{additionalInfo.city}</p>
            </div>
          </div>
          <div>
            <p className="font-semibold text-black">Conclusão:</p>
            <p className="text-black">{additionalInfo.conclusion}</p>
          </div>
          {additionalInfo.collected_at && (
            <div>
              <p className="font-semibold text-black">Data de Coleta:</p>
              <p className="text-black">
                {format(new Date(additionalInfo.collected_at), "dd/MM/yyyy", { locale: ptBR })}
              </p>
            </div>
          )}
          {additionalInfo.closed_at && (
            <div>
              <p className="font-semibold text-black">Data de Fechamento:</p>
              <p className="text-black">
                {format(new Date(additionalInfo.closed_at), "dd/MM/yyyy", { locale: ptBR })}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Relational Info Section */}
      <section className="mb-8 print-force-show">
        <h2 className="text-2xl font-bold mb-4 text-black">Informações Relacionais</h2>
        {/* Products */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2 text-black">Produtos</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left bg-gray-100 text-black">Nome</th>
                <th className="border border-gray-300 p-2 text-left bg-gray-100 text-black">Peso</th>
              </tr>
            </thead>
            <tbody>
              {relationalInfo.products.map((product) => (
                <tr key={product.id}>
                  <td className="border border-gray-300 p-2 text-black">{product.name}</td>
                  <td className="border border-gray-300 p-2 text-black">{product.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Contacts */}
        <div>
          <h3 className="text-xl font-semibold mb-2 text-black">Contatos</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left bg-gray-100 text-black">Nome</th>
                <th className="border border-gray-300 p-2 text-left bg-gray-100 text-black">Telefone</th>
                <th className="border border-gray-300 p-2 text-left bg-gray-100 text-black">Email</th>
              </tr>
            </thead>
            <tbody>
              {relationalInfo.contacts.map((contact) => (
                <tr key={contact.id}>
                  <td className="border border-gray-300 p-2 text-black">{contact.name}</td>
                  <td className="border border-gray-300 p-2 text-black">{contact.phone}</td>
                  <td className="border border-gray-300 p-2 text-black">{contact.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="mb-8 print-force-show">
        <h2 className="text-2xl font-bold mb-4 text-black">Workflow</h2>
          <div className="space-y-4">
            {workflowInfo.transitions.map((transition) => (
              <div key={transition.id} className="border-l-2 border-gray-300 pl-4">
                <div className="flex justify-between">
                  <div>
                  <p className="font-semibold text-black">
                    {getWorkflowStatusDisplayName(transition.from_status)} → {getWorkflowStatusDisplayName(transition.to_status)}
                  </p>
                  {transition.notes && (
                    <p className="text-gray-600">{transition.notes}</p>
                  )}
                </div>
                <time className="text-sm text-gray-500">
                  {format(new Date(transition.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </time>
              </div>
                {transition.created_by_profile?.name && (
                  <p className="text-sm text-gray-500">
                    por {transition.created_by_profile.name}
                  </p>
                )}
              </div>
            ))}
          </div>
      </section>

      {/* Timeline Section */}
      <section className="print-force-show">
        <h2 className="text-2xl font-bold mb-4 text-black">Timeline de Eventos</h2>
          <div className="space-y-4">
            {rnc.events.map((event) => (
              <div key={event.id} className="border-l-2 border-gray-300 pl-4">
                <div className="flex justify-between">
                  <h4 className="font-semibold text-black">{event.title}</h4>
                  <time className="text-sm text-gray-500">
                    {format(new Date(event.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </time>
                </div>
                <p className="text-gray-600">{event.description}</p>
                {event.created_by_profile?.name && (
                  <p className="text-sm text-gray-500">
                    por {event.created_by_profile.name}
                  </p>
                )}
              </div>
            ))}
          </div>
      </section>
    </div>
  );
}