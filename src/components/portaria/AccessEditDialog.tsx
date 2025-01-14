import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AccessEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accessLog;
}

export function AccessEditDialog({ open, onOpenChange, accessLog }: AccessEditDialogProps) {
  const [formData, setFormData] = useState({
    purpose: accessLog?.purpose || "",
    notes: accessLog?.notes || "",
    cargo_description: accessLog?.cargo_description || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('truck_access_logs')
        .update(formData)
        .eq('id', accessLog.id);

      if (error) throw error;
      
      toast.success("Registro atualizado com sucesso!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao atualizar registro: " + error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Registro de Acesso</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="purpose">Tipo de Operação</Label>
            <Select
              value={formData.purpose}
              onValueChange={(value) => setFormData(prev => ({ ...prev, purpose: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de operação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="loading">Carga</SelectItem>
                <SelectItem value="unloading">Descarga</SelectItem>
                <SelectItem value="both">Descarga/Carga</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cargo_description">Descrição da Carga</Label>
            <Input
              id="cargo_description"
              value={formData.cargo_description}
              onChange={(e) => setFormData(prev => ({ ...prev, cargo_description: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}