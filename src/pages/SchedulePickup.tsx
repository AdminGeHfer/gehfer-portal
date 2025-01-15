import { useState } from "react";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SchedulePickup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const complaint = location.state?.complaint;

  const [pickupData, setPickupData] = useState({
    date: "",
    time: "",
    address: "",
    contact: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPickupData({
      ...pickupData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupData.date || !pickupData.time || !pickupData.address) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    toast.success("Coleta programada com sucesso!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="glass-card p-8 animate-scale-in dark:bg-gray-800/50">
          <h2 className="text-2xl font-semibold mb-6 dark:text-gray-100">
            Programar Coleta
          </h2>
          
          <div className="mb-8 p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-xl">
            <h3 className="font-medium mb-2 dark:text-gray-200">Detalhes da Reclamação</h3>
            <p><span className="text-gray-600 dark:text-gray-400">Protocolo:</span> <span className="dark:text-gray-200">{complaint?.protocol}</span></p>
            <p><span className="text-gray-600 dark:text-gray-400">Empresa:</span> <span className="dark:text-gray-200">{complaint?.company}</span></p>
            <p><span className="text-gray-600 dark:text-gray-400">Descrição:</span> <span className="dark:text-gray-200">{complaint?.description}</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label dark:text-gray-300">Data da Coleta *</label>
              <input
                type="date"
                name="date"
                value={pickupData.date}
                onChange={handleChange}
                className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                required
              />
            </div>

            <div>
              <label className="label dark:text-gray-300">Horário *</label>
              <input
                type="time"
                name="time"
                value={pickupData.time}
                onChange={handleChange}
                className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                required
              />
            </div>

            <div>
              <label className="label dark:text-gray-300">Endereço de Coleta *</label>
              <input
                type="text"
                name="address"
                value={pickupData.address}
                onChange={handleChange}
                className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                placeholder="Endereço completo para coleta"
                required
              />
            </div>

            <div>
              <label className="label dark:text-gray-300">Contato</label>
              <input
                type="text"
                name="contact"
                value={pickupData.contact}
                onChange={handleChange}
                className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                placeholder="Nome e telefone para contato"
              />
            </div>

            <div>
              <label className="label dark:text-gray-300">Observações</label>
              <textarea
                name="notes"
                value={pickupData.notes}
                onChange={handleChange}
                className="input-field min-h-[100px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                placeholder="Informações adicionais para a coleta"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" className="btn-primary">
                Confirmar Agendamento
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 border border-gray-200/80 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium dark:text-gray-200"
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

export default SchedulePickup;