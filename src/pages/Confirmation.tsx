import { useLocation, useNavigate } from "react-router-dom";
import React from 'react';

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;

  if (!formData) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto glass-card p-6 animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-success"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reclamação Enviada com Sucesso!
          </h1>
          <p className="text-gray-600 mt-2">
            Protocolo: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-gray-900">
            Resumo da Reclamação
          </h2>
          <div className="grid gap-4 text-sm">
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">CNPJ:</span>
              <span className="font-medium">{formData.cnpj}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Razão Social:</span>
              <span className="font-medium">{formData.razaoSocial}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Solicitante:</span>
              <span className="font-medium">{formData.solicitante}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Material:</span>
              <span className="font-medium">{formData.material}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-primary flex-1"
          >
            Voltar ao Dashboard
          </button>
          <button
            onClick={() => navigate("/new-complaint")}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-1"
          >
            Nova Reclamação
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;