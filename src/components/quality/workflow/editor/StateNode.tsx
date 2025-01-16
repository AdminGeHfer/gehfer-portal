import * as React from "react";
import { Handle, NodeProps, Position } from 'reactflow';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { Save } from 'lucide-react';

interface StateNodeData {
  label: string;
  type: string;
  assigned_to?: string;
  send_email?: boolean;
  email_template?: string;
  onAssigneeChange?: (value: string) => void;
  onEmailToggle?: (checked: boolean) => void;
  onEmailTemplateChange?: (value: string) => void;
}

export function StateNode({ data }: NodeProps<StateNodeData>) {
  const [localTemplate, setLocalTemplate] = useState(data.email_template || '');
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name')
        .eq('active', true);
      
      if (error) throw error;
      return data;
    }
  });

  const handleSaveTemplate = () => {
    data.onEmailTemplateChange?.(localTemplate);
  };

  const getStateColor = (type: string) => {
    switch (type) {
      case 'open':
        return 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/50 dark:border-yellow-700';
      case 'analysis':
        return 'bg-blue-100 border-blue-300 dark:bg-blue-900/50 dark:border-blue-700';
      case 'resolution':
        return 'bg-purple-100 border-purple-300 dark:bg-purple-900/50 dark:border-purple-700';
      case 'solved':
        return 'bg-green-100 border-green-300 dark:bg-green-900/50 dark:border-green-700';
      case 'closing':
        return 'bg-orange-100 border-orange-300 dark:bg-orange-900/50 dark:border-orange-700';
      case 'closed':
        return 'bg-gray-100 border-gray-300 dark:bg-gray-900/50 dark:border-gray-700';
      default:
        return 'bg-gray-100 border-gray-300 dark:bg-gray-900/50 dark:border-gray-700';
    }
  };

  return (
    <div className={cn(
      "px-4 py-2 shadow-lg rounded-lg border-2",
      "transition-colors duration-200",
      "min-w-[240px]",
      getStateColor(data.type)
    )}>
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-gray-400 !w-3 !h-3"
      />
      
      <div className="space-y-3">
        <div className="text-center">
          <div className="font-medium">{data.label}</div>
          <Badge variant="secondary" className="mt-1">
            {data.type}
          </Badge>
        </div>

        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm">Enviar Email</span>
            <Switch
              checked={data.send_email}
              onCheckedChange={data.onEmailToggle}
            />
          </div>

          {data.send_email && (
            <div className="space-y-2">
              <textarea
                placeholder="Template do email... 
Variáveis disponíveis:
{nome} - Nome do usuário atribuído
{numero_rnc} - Número da RNC
{status_anterior} - Status anterior
{status_novo} - Novo status"
                value={localTemplate}
                onChange={(e) => setLocalTemplate(e.target.value)}
                className="w-full text-sm p-2 rounded border min-h-[120px]"
                rows={5}
              />
              <Button 
                onClick={handleSaveTemplate}
                className="w-full"
                size="sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Template
              </Button>
            </div>
          )}

          <Select
            value={data.assigned_to || "unassigned"}
            onValueChange={data.onAssigneeChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Atribuir a..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Ninguém</SelectItem>
              {users?.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-gray-400 !w-3 !h-3"
      />
    </div>
  );
}