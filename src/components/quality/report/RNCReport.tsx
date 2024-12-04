import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RNC } from "@/types/rnc";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { RNCTimeline } from "../RNCTimeline";

interface RNCReportProps {
  rnc: RNC;
}

export function RNCReport({ rnc }: RNCReportProps) {
  return (
    <div className="space-y-4 p-8">
      <Card>
        <CardHeader>
          <CardTitle>RNC #{rnc.rnc_number}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Descrição</h3>
              <p>{rnc.description}</p>
            </div>
            <div>
              <h3 className="font-semibold">Empresa</h3>
              <p>{rnc.company}</p>
              <p>{rnc.cnpj}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Contato</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><span className="font-semibold">Nome:</span> {rnc.contact.name}</p>
            <p><span className="font-semibold">Email:</span> {rnc.contact.email}</p>
            <p><span className="font-semibold">Telefone:</span> {rnc.contact.phone}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico do Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <RNCTimeline rncId={rnc.id} />
        </CardContent>
      </Card>
    </div>
  );
}