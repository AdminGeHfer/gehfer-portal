import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ColorPicker } from "@/components/ui/color-picker";

interface BasicConfigStepProps {
  data: {
    name: string;
    description: string;
    icon: string;
    color: string;
  };
  onChange: (data: Partial<BasicConfigStepProps['data']>) => void;
}

export const BasicConfigStep = ({ data, onChange }: BasicConfigStepProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Configuração Básica</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Agente</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Ex: Assistente de Vendas"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Descreva o propósito deste agente..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="icon">Ícone</Label>
            <Input
              id="icon"
              value={data.icon}
              onChange={(e) => onChange({ icon: e.target.value })}
              placeholder="Nome do ícone"
            />
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
            <ColorPicker
              color={data.color}
              onChange={(color) => onChange({ color })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};