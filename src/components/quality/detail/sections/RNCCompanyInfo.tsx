import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RNC } from "@/types/rnc";

interface RNCCompanyInfoProps {
  rnc: RNC;
}

export function RNCCompanyInfo({ rnc }: RNCCompanyInfoProps) {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Dados da Empresa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Razão Social</p>
            <p className="text-lg">{rnc.company}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">CNPJ</p>
            <p className="text-lg">{rnc.cnpj}</p>
          </div>
          {rnc.orderNumber && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nº do Pedido</p>
              <p className="text-lg">{rnc.orderNumber}</p>
            </div>
          )}
          {rnc.returnNumber && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nº da Devolução</p>
              <p className="text-lg">{rnc.returnNumber}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}