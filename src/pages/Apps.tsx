import { Card } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { useNavigate } from "react-router-dom";
import { ClipboardCheck, Users } from "lucide-react";

const Apps = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-2">Selecione um módulo para começar</h2>
          <p className="text-gray-500 mb-8">Acesse as ferramentas e recursos disponíveis</p>
        
          <div className="grid gap-6 md:grid-cols-2">
            <Card 
              className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
              onClick={() => navigate("/quality")}
            >
              <div className="bg-gray-100 p-8 flex justify-center items-center group-hover:bg-gray-200 transition-colors">
                <ClipboardCheck className="h-12 w-12 text-gray-600" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Qualidade</h3>
                <p className="text-gray-500 mb-4">Gestão de qualidade e controle de processos</p>
                <div className="flex items-center text-primary hover:underline">
                  Acessar módulo
                </div>
              </div>
            </Card>

            <Card 
              className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
              onClick={() => navigate("/admin")}
            >
              <div className="bg-gray-100 p-8 flex justify-center items-center group-hover:bg-gray-200 transition-colors">
                <Users className="h-12 w-12 text-gray-600" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Administração</h3>
                <p className="text-gray-500 mb-4">Ferramentas para gerenciar sua equipe e recursos</p>
                <div className="flex items-center text-primary hover:underline">
                  Acessar módulo
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 w-full border-t bg-white p-4">
        <div className="container mx-auto flex justify-between items-center text-sm text-gray-500">
          <span>© 2024 GeHfer. Todos os direitos reservados.</span>
          <div className="flex gap-4">
            <button className="hover:text-gray-900">Sobre</button>
            <button className="hover:text-gray-900">Ajuda</button>
            <span>v1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Apps;