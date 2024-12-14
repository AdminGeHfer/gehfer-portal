import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, AlertCircle, Loader2 } from "lucide-react";

interface ValidationStepProps {
  data: {
    type: string;
    name: string;
    externalUrl?: string;
  };
  onTest: () => Promise<void>;
  isConnectionTesting: boolean;
}

export const ValidationStep = ({ data, onTest, isConnectionTesting }: ValidationStepProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Teste e Validação</h2>
      
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Configurações do Agente</h3>
              <p className="text-sm text-muted-foreground">
                Tipo: {data.type}
                <br />
                Nome: {data.name}
                {data.externalUrl && (
                  <>
                    <br />
                    URL: {data.externalUrl}
                  </>
                )}
              </p>
            </div>
            <Check className="h-6 w-6 text-green-500" />
          </div>

          {(data.type === 'n8n' || data.type === 'flowise') && (
            <div>
              <Button
                variant="outline"
                onClick={onTest}
                disabled={isConnectionTesting}
                className="w-full"
              >
                {isConnectionTesting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testando Conexão...
                  </>
                ) : (
                  'Testar Conexão'
                )}
              </Button>
            </div>
          )}
        </div>
      </Card>

      <div className="flex items-center gap-2 text-yellow-500">
        <AlertCircle className="h-5 w-5" />
        <p className="text-sm">
          Certifique-se de que todas as configurações estão corretas antes de criar o agente.
        </p>
      </div>
    </div>
  );
};