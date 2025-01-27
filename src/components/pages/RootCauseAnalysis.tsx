import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const analysisSchema = z.object({
  rootCause: z.string().min(10, "A causa raiz deve ter no mínimo 10 caracteres"),
  solution: z.string().min(10, "A solução deve ter no mínimo 10 caracteres"),
  actionPlan: z.string().min(10, "O plano de ação deve ter no mínimo 10 caracteres"),
  responsible: z.string().optional(),
  deadline: z.string().optional(),
});

type AnalysisFormData = z.infer<typeof analysisSchema>;

const RootCauseAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const complaint = location.state?.complaint;

  const form = useForm<AnalysisFormData>({
    resolver: zodResolver(analysisSchema),
    defaultValues: {
      rootCause: "",
      solution: "",
      actionPlan: "",
      responsible: "",
      deadline: "",
    },
  });

  // Load saved form data from localStorage if it exists
  React.useEffect(() => {
    const savedData = localStorage.getItem('rncAnalysisData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      Object.keys(parsedData).forEach((key) => {
        form.setValue(key as keyof AnalysisFormData, parsedData[key]);
      });
    }
  }, [form]);

  // Save form data to localStorage whenever it changes
  React.useEffect(() => {
    const subscription = form.watch((data) => {
      localStorage.setItem('rncAnalysisData', JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onSubmit = async () => {
    try {
      // Here you would typically save the data to your backend
      toast.success("Análise salva com sucesso!");
      localStorage.removeItem('rncAnalysisData'); // Clear saved data after successful save
      navigate("/dashboard");
    } catch {
      toast.error("Erro ao salvar análise");
    }
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

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="rootCause"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="label">Causa Raiz *</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        className="input-field min-h-[100px]"
                        placeholder="Descreva a causa raiz do problema..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="solution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="label">Solução Proposta *</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        className="input-field min-h-[100px]"
                        placeholder="Descreva a solução proposta..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="actionPlan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="label">Plano de Ação *</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        className="input-field min-h-[100px]"
                        placeholder="Detalhe o plano de ação..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="responsible"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="label">Responsável</FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        {...field}
                        className="input-field"
                        placeholder="Nome do responsável..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="label">Prazo</FormLabel>
                    <FormControl>
                      <input
                        type="date"
                        {...field}
                        className="input-field"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4">
                <button type="submit" className="btn-primary">
                  Salvar Análise
                </button>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('rncAnalysisData');
                    navigate("/dashboard");
                  }}
                  className="px-6 py-3 border border-gray-200/80 rounded-full hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RootCauseAnalysis;