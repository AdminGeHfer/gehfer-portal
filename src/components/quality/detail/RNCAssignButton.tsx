import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserCheck } from "lucide-react";

interface RNCAssignButtonProps {
  rncId: string;
  currentAssignee?: string;
  onAssigned: () => void;
}

export function RNCAssignButton({ rncId, currentAssignee, onAssigned }: RNCAssignButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>(currentAssignee || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name")
        .eq("active", true);
      
      if (error) throw error;
      return data;
    }
  });

  const handleAssign = async () => {
    if (!selectedUser) return;
    
    try {
      setIsSubmitting(true);
      const { data: userData } = await supabase.auth.getUser();
      
      // First get the current RNC to preserve its data
      const { data: currentRnc } = await supabase
        .from("rncs")
        .select('*')
        .eq("id", rncId)
        .single();

      if (!currentRnc) throw new Error("RNC not found");

      const { error: updateError } = await supabase
        .from("rncs")
        .update({
          ...currentRnc,
          assigned_to: selectedUser,
          assigned_by: userData.user?.id,
          assigned_at: new Date().toISOString()
        })
        .eq("id", rncId);

      if (updateError) throw updateError;

      const { error: eventError } = await supabase
        .from("rnc_events")
        .insert({
          rnc_id: rncId,
          title: "RNC Atribuída",
          description: "RNC foi atribuída a um novo responsável",
          type: "assignment",
          created_by: userData.user?.id
        });

      if (eventError) throw eventError;

      toast.success("RNC atribuída com sucesso!");
      setIsOpen(false);
      onAssigned();
    } catch (error) {
      console.error("Error assigning RNC:", error);
      toast.error("Erro ao atribuir RNC");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserCheck className="mr-2 h-4 w-4" />
          {currentAssignee ? "Alterar Responsável" : "Atribuir"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atribuir RNC</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um usuário" />
            </SelectTrigger>
            <SelectContent>
              {users?.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleAssign}
            disabled={isSubmitting || !selectedUser}
            className="w-full"
          >
            {isSubmitting ? "Atribuindo..." : "Confirmar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}