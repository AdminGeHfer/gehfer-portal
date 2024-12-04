import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const NewComplaint = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cnpj: "",
    razaoSocial: "",
    solicitante: "",
    pedidoNota: "",
    material: "",
    observacao: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cnpj || !formData.razaoSocial || !formData.solicitante) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    toast.success("Reclamação enviada com sucesso!");
    navigate("/confirmation", { state: { formData } });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto glass-card p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Nova Reclamação</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cnpj" className="label">CNPJ *</label>
            <input
              type="text"
              id="cnpj"
              name="cnpj"
              value={formData.cnpj}
              onChange={handleChange}
              className="input-field"
              placeholder="00.000.000/0000-00"
              required
            />
          </div>

          <div>
            <label htmlFor="razaoSocial" className="label">Razão Social *</label>
            <input
              type="text"
              id="razaoSocial"
              name="razaoSocial"
              value={formData.razaoSocial}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="solicitante" className="label">Solicitante *</label>
            <input
              type="text"
              id="solicitante"
              name="solicitante"
              value={formData.solicitante}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="pedidoNota" className="label">Pedido/Nota</label>
            <input
              type="text"
              id="pedidoNota"
              name="pedidoNota"
              value={formData.pedidoNota}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="material" className="label">Material</label>
            <input
              type="text"
              id="material"
              name="material"
              value={formData.material}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="observacao" className="label">Motivo/Observação</label>
            <textarea
              id="observacao"
              name="observacao"
              value={formData.observacao}
              onChange={handleChange}
              className="input-field min-h-[100px]"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="btn-primary flex-1">
              Enviar Reclamação
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-1"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewComplaint;