import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AddStateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflowId?: string;
  onStateAdded: () => void;
}

type StateType = 'open' | 'analysis' | 'resolution' | 'solved' | 'closing' | 'closed';

export function AddStateDialog({
  open,
  onOpenChange,
  workflowId,
  onStateAdded,
}: AddStateDialogProps) {
  const [label, setLabel] = useState('');
  const [type, setType] = useState<StateType>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !type || !workflowId) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('workflow_states').insert({
        workflow_id: workflowId,
        label,
        state_type: type,
        position_x: 100,
        position_y: 100,
      });

      if (error) throw error;

      toast.success('Estado adicionado com sucesso');
      onStateAdded();
      setLabel('');
      setType(undefined);
    } catch (error) {
      console.error('Erro ao adicionar estado:', error);
      toast.error('Erro ao adicionar estado');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Estado</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="label">Nome do Estado</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Digite o nome do estado"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select value={type} onValueChange={(value) => setType(value as StateType)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo do estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Aberto</SelectItem>
                <SelectItem value="analysis">Em Análise</SelectItem>
                <SelectItem value="resolution">Em Resolução</SelectItem>
                <SelectItem value="solved">Solucionado</SelectItem>
                <SelectItem value="closing">Em Fechamento</SelectItem>
                <SelectItem value="closed">Encerrado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Adicionar Estado
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}