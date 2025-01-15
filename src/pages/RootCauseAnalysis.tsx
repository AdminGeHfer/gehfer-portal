import { useState } from "react";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const RootCauseAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const complaint = location.state?.complaint;

  const [analysis, setAnalysis] = useState({
    rootCause: "",
    solution: "",
    actionPlan: "",
    responsible: "",
    deadline: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAnalysis({
      ...analysis,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!analysis.rootCause || !analysis.solution || !analysis.actionPlan) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    toast.success("Análise salva com sucesso!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="glass-card p-8 animate-scale-in">
          <h2 className="text-2xl font-semibold mb-6">Análise de Causa Raiz</h2>
          
          <div className="mb-8 p-4 bg-gray-50/50 rounded-xl">
            <h3 className="font-medium mb-2">Detalhes da Reclamação</h3>
            <p><span className="text-gray-600">Protocolo:</span> {complaint?.protocol}</p>
            <p><span className="text-gray-600">Empresa:</span> {complaint?.company}</p>
            <p><span className="text-gray-600">Descrição:</span> {complaint?.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Causa Raiz *</label>
              <textarea
                name="rootCause"
                value={analysis.rootCause}
                onChange={handleChange}
                className="input-field min-h-[100px]"
                placeholder="Descreva a causa raiz do problema..."
              />
            </div>

            <div>
              <label className="label">Solução Proposta *</label>
              <textarea
                name="solution"
                value={analysis.solution}
                onChange={handleChange}
                className="input-field min-h-[100px]"
                placeholder="Descreva a solução proposta..."
              />
            </div>

            <div>
              <label className="label">Plano de Ação *</label>
              <textarea
                name="actionPlan"
                value={analysis.actionPlan}
                onChange={handleChange}
                className="input-field min-h-[100px]"
                placeholder="Detalhe o plano de ação..."
              />
            </div>

            <div>
              <label className="label">Responsável</label>
              <input
                type="text"
                name="responsible"
                value={analysis.responsible}
                onChange={handleChange}
                className="input-field"
                placeholder="Nome do responsável..."
              />
            </div>

            <div>
              <label className="label">Prazo</label>
              <input
                type="date"
                name="deadline"
                value={analysis.deadline}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" className="btn-primary">
                Salvar Análise
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 border border-gray-200/80 rounded-full hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RootCauseAnalysis;