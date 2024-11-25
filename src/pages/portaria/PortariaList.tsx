import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { TruckQueue } from "@/components/portaria/TruckQueue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterTruckDialog } from "@/components/portaria/RegisterTruckDialog";
import { useState } from "react";
import { usePortariaTrucks } from "@/hooks/usePortariaTrucks";
import { Truck, Clock, AlertCircle } from "lucide-react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const PortariaList = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { trucks } = usePortariaTrucks();

  const trucksInOperation = trucks.filter(truck => truck.status === "in_process");
  const averageWaitTime = 45; // TODO: Calculate from actual data

  return (
    <div className="min-h-screen bg-background">
      <Header title="Gestão de Filas" />
      
      <div className="flex min-h-screen">
        <aside className="w-64 border-r bg-card">
          <div className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/portaria/acesso")}
            >
              Voltar para Controle de Acesso
            </Button>
          </div>
          <nav className="space-y-1 p-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/portaria/acesso")}
            >
              Controle de Acesso
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start"
            >
              Gestão de Filas
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/portaria/entregas-pendentes")}
            >
              Cargas
            </Button>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Em Operação
                </CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {trucksInOperation.length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tempo Médio de Espera
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageWaitTime} min</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Em Espera
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {trucks.filter(t => t.status === "waiting").length}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Gestão de Filas</h2>
              <p className="text-muted-foreground">
                Arraste os caminhões entre as filas para organizar as operações
              </p>
            </div>
            
            <Button onClick={() => setIsDialogOpen(true)}>
              Adicionar à Fila
            </Button>
          </div>

          <DndProvider backend={HTML5Backend}>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TruckQueue 
                    title="Baia 1" 
                    id="baia1" 
                  />
                  <TruckQueue 
                    title="Baia 2" 
                    id="baia2"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TruckQueue 
                    title="Baia 3" 
                    id="baia3"
                  />
                  <TruckQueue 
                    title="Baia 4" 
                    id="baia4"
                  />
                </div>
                <TruckQueue 
                  title="Baia 5" 
                  id="baia5"
                />
              </div>

              <div>
                <TruckQueue 
                  title="Em Espera" 
                  id="waiting"
                />
              </div>
            </div>
          </DndProvider>

          <RegisterTruckDialog 
            open={isDialogOpen} 
            onOpenChange={setIsDialogOpen} 
          />
        </main>
      </div>
    </div>
  );
};

export default PortariaList;