import React from "react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Complaint } from "@/types/complaint";

interface ComplaintDetailsProps {
  complaint: Complaint;
  onStatusUpdate: (complaintId: number, newStatus: string) => void;
  onClose: () => void;
}

export const ComplaintDetails = ({ complaint, onStatusUpdate, onClose }: ComplaintDetailsProps) => {
  const navigate = useNavigate();

  return (
    <div className="mt-8 p-8 bg-white/50 dark:bg-gray-800/50 rounded-2xl animate-fade-in border border-gray-200/50">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Detalhes da Reclamação
      </h3>
      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Protocolo:</span>
            <p className="font-medium mt-1 dark:text-gray-200">{complaint.protocol}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Data:</span>
            <p className="font-medium mt-1 dark:text-gray-200">
              {new Date(complaint.date).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
        <div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Descrição:</span>
          <p className="font-medium mt-1 dark:text-gray-200">{complaint.description}</p>
        </div>
        <div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
          <Select
            defaultValue={complaint.status}
            onValueChange={(value) => onStatusUpdate(complaint.id, value)}
          >
            <SelectTrigger className="w-[200px] mt-1">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Em análise">Em análise</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Programar Coleta">Programar Coleta</SelectItem>
              <SelectItem value="Coleta Programada">Coleta Programada</SelectItem>
              <SelectItem value="Resolvido">Resolvido</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Causa Raiz:</span>
          <p className="font-medium mt-1 dark:text-gray-200">
            {complaint.rootCause || "Não definida"}
          </p>
        </div>
        <div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Solução:</span>
          <p className="font-medium mt-1 dark:text-gray-200">
            {complaint.solution || "Não definida"}
          </p>
        </div>
        <div className="flex gap-4 pt-4">
          <button
            onClick={() => navigate("/root-cause-analysis", { state: { complaint } })}
            className="btn-primary"
          >
            Análise de Causa Raiz
          </button>
          {complaint.status === "Programar Coleta" && (
            <button
              onClick={() => navigate("/schedule-pickup", { state: { complaint } })}
              className="btn-primary bg-warning"
            >
              Programar Coleta
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-200/80 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium dark:text-gray-200"
          >
            Fechar Detalhes
          </button>
        </div>
      </div>
    </div>
  );
};