import * as React from 'react';
import { RNCWithRelations } from "@/types/rnc";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RNCDetailsProps {
  rnc: RNCWithRelations;
  onClose: () => void;
}

export function RNCDetails({ rnc, onClose }: RNCDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">RNC #{rnc.rnc_number}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Informações Básicas</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-gray-500">Empresa</p>
                <p>{rnc.company}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Data de Criação</p>
                <p>
                  {format(new Date(rnc.created_at), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p>{rnc.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tipo</p>
                <p>{rnc.type}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Descrição</h3>
            <p className="mt-2">{rnc.description}</p>
          </div>

          {rnc.conclusion && (
            <div>
              <h3 className="font-semibold">Conclusão</h3>
              <p className="mt-2">{rnc.conclusion}</p>
            </div>
          )}

          {rnc.contacts && rnc.contacts.length > 0 && (
            <div>
              <h3 className="font-semibold">Contatos</h3>
              <div className="space-y-2 mt-2">
                {rnc.contacts.map((contact) => (
                  <div key={contact.id}>
                    <p>{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.phone}</p>
                    {contact.email && (
                      <p className="text-sm text-gray-500">{contact.email}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
